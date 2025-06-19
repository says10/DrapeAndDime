import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Customer from "@/lib/models/Customer";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    // Clerk user.created webhook payload: https://clerk.com/docs/reference/webhooks/events/user-created
    const user = body.data;
    if (!user) {
      return new NextResponse("No user data in webhook payload", { status: 400 });
    }

    const clerkId = user.id;
    const email = user.email_addresses?.[0]?.email_address || user.email_address || null;
    const name = user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || "User";

    if (!clerkId || !email) {
      return new NextResponse("Missing required user info", { status: 400 });
    }

    // Check if customer already exists
    let customer = await Customer.findOne({ clerkId });
    if (!customer) {
      customer = new Customer({
        clerkId,
        name,
        email,
        orders: [],
      });
      await customer.save();
    }

    // Send welcome email
    await sendEmail({
      to: email,
      subject: "Welcome to DrapeAndDime!",
      html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining DrapeAndDime. We're excited to have you!</p>`,
    });

    return new NextResponse("Customer created and welcome email sent", { status: 200 });
  } catch (err) {
    console.error("[clerk-user-created webhook]", err);
    return new NextResponse("Failed to create customer or send email", { status: 500 });
  }
} 