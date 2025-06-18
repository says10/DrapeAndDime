import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Check authorization as per Vercel docs
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Cron job authorization working!',
    timestamp: new Date().toISOString()
  });
} 