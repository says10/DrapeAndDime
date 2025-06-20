import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import Coupon from '@/lib/models/Coupon';
import UsedCoupon from '@/lib/models/UsedCoupon';

export async function POST(req: NextRequest) {
  await connectToDB();
  const { code, userId, paymentMethod, orderTotal, userOrderCount } = await req.json();

  let valid = false;
  let discountPercent = 0;
  let message = '';
  let appliedCoupon = null;
  let discountAmount = 0;

  if (!code) {
    return NextResponse.json({ valid: false, discountPercent: 0, message: 'No coupon code provided.' }, { status: 400 });
  }

  // Always uppercase and trim code
  const couponCode = code.trim().toUpperCase();

  // Find coupon in DB
  const coupon = await Coupon.findOne({ code: couponCode });
  if (!coupon) {
    return NextResponse.json({ valid: false, discountPercent: 0, message: 'Invalid coupon code.' }, { status: 404 });
  }

  // Check allowed payment method
  if (
    coupon.allowedPayments !== 'both' &&
    coupon.allowedPayments !== paymentMethod
  ) {
    return NextResponse.json({ valid: false, discountPercent: 0, message: `Coupon not valid for this payment method.` }, { status: 400 });
  }

  // Check minOrderValue
  if (coupon.minOrderValue && (!orderTotal || orderTotal < coupon.minOrderValue)) {
    return NextResponse.json({ valid: false, discountPercent: 0, message: `Order total must be at least ${coupon.minOrderValue} to use this coupon.` }, { status: 400 });
  }

  // Check minOrderCount and maxOrderCount
  if (coupon.minOrderCount && (!userOrderCount || userOrderCount < coupon.minOrderCount)) {
    return NextResponse.json({ valid: false, discountPercent: 0, message: `Coupon only valid on your ${coupon.minOrderCount}${coupon.minOrderCount === 1 ? 'st' : coupon.minOrderCount === 2 ? 'nd' : coupon.minOrderCount === 3 ? 'rd' : 'th'} order or later.` }, { status: 400 });
  }
  if (coupon.maxOrderCount && userOrderCount && userOrderCount > coupon.maxOrderCount) {
    return NextResponse.json({ valid: false, discountPercent: 0, message: `Coupon only valid up to your ${coupon.maxOrderCount}${coupon.maxOrderCount === 1 ? 'st' : coupon.maxOrderCount === 2 ? 'nd' : coupon.maxOrderCount === 3 ? 'rd' : 'th'} order.` }, { status: 400 });
  }

  // Check one-time use for WELCOME5
  if (couponCode === 'WELCOME5') {
    if (!userId) {
      return NextResponse.json({ valid: false, discountPercent: 0, message: 'User not logged in.' }, { status: 400 });
    }
    const alreadyUsed = await UsedCoupon.findOne({ userId, code: 'WELCOME5' });
    if (alreadyUsed) {
      return NextResponse.json({ valid: false, discountPercent: 0, message: 'Welcome coupon already used.' }, { status: 400 });
    }
  }

  valid = true;
  discountPercent = coupon.discount;
  message = `${couponCode} coupon applied!`;
  appliedCoupon = couponCode;

  // Calculate discount amount and cap at maxDiscount if set
  if (orderTotal && coupon.type === 'percentage') {
    discountAmount = (orderTotal * coupon.discount) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
      message += ` (Max discount applied: ${coupon.maxDiscount})`;
    }
  } else if (orderTotal && coupon.type === 'fixed') {
    discountAmount = coupon.discount;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
      message += ` (Max discount applied: ${coupon.maxDiscount})`;
    }
  }

  return NextResponse.json({ valid, discountPercent, discountAmount, message, appliedCoupon });
} 