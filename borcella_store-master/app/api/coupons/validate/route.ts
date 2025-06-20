import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import Coupon from '@/lib/models/Coupon';
import UsedCoupon from '@/lib/models/UsedCoupon';

export async function POST(req: NextRequest) {
  await connectToDB();
  const { code, userId, paymentMethod } = await req.json();

  let valid = false;
  let discountPercent = 0;
  let message = '';
  let appliedCoupon = null;

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

  return NextResponse.json({ valid, discountPercent, message, appliedCoupon });
} 