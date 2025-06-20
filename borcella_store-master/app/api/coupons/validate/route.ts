import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongoDB';
import UsedCoupon from '@/lib/models/UsedCoupon';

export async function POST(req: NextRequest) {
  await connectToDB();
  const { code, userId } = await req.json();

  let valid = false;
  let discountPercent = 0;
  let message = '';
  let appliedCoupon = null;

  if (code === 'WELCOME5') {
    if (!userId) {
      return NextResponse.json({ valid: false, discountPercent: 0, message: 'User not logged in.' }, { status: 400 });
    }
    // Check if user has already used this coupon
    const alreadyUsed = await UsedCoupon.findOne({ userId, code: 'WELCOME5' });
    if (alreadyUsed) {
      message = 'Welcome coupon already used.';
    } else {
      valid = true;
      discountPercent = 5;
      message = 'Welcome coupon applied!';
      appliedCoupon = 'WELCOME5';
    }
  } else if (code === 'PREPAID2') {
    valid = true;
    discountPercent = 2;
    message = '2% prepaid coupon applied!';
    appliedCoupon = 'PREPAID2';
  } else {
    message = 'Invalid coupon code.';
  }

  return NextResponse.json({ valid, discountPercent, message, appliedCoupon });
} 