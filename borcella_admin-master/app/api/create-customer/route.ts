import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const { clerkId, email, name } = await req.json();

    if (!clerkId || !email) {
      return new NextResponse("Missing required user info", { status: 400 });
    }

    let customer = await Customer.findOne({ clerkId });
    if (!customer) {
      customer = new Customer({ clerkId, name, email, orders: [] });
      await customer.save();
      await sendEmail({
        to: email,
        subject: "Welcome to DrapeAndDime!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1 style="color: #764ba2;">Welcome, ${name || "there"}!</h1>
            <p>Thank you for joining <b>DrapeAndDime</b>. We're thrilled to have you as part of our fashion community!</p>
            <p>Start shopping the latest trends now: <a href="https://drapeanddime.shop" style="color: #667eea;">Visit our store</a></p>
            <hr/>
            <p style="font-size: 12px; color: #888;">If you have any questions, reply to this email or contact our support team.</p>
          </div>
        `,
      });
    }

    return new NextResponse("Customer created and welcome email sent", { status: 200 });
  } catch (err) {
    console.error("[create-customer]", err);
    return new NextResponse("Failed to create customer or send email", { status: 500 });
  }
} 