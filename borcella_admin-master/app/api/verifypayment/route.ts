import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product"; // Import Product model to update stock
import Customer from "@/lib/models/Customer"; // Import Customer model
import { connectToDB } from "@/lib/mongoDB";
import { sendEmail } from "@/lib/email";
import { Cashfree } from "cashfree-pg"; // Import Cashfree

const allowedOrigin = `https://drapeanddime.shop`;

// Handle OPTIONS preflight request
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("🔐 Verifying Cashfree Payment");
    console.log("🌍 Request Origin:", req.headers.get("origin"));
    console.log("🔍 Full Request Headers:", Object.fromEntries(req.headers.entries()));

    await connectToDB();

    const body = await req.json();
    console.log("📩 Received payment verification request body:", body);

    const { orderId } = body; // We only need the orderId to fetch payment details

    // Check if the necessary field is present
    if (!orderId) {
      console.log("❌ Missing orderId. Verification cannot proceed.");
      return new NextResponse("Missing orderId", { status: 400 });
    }

    // Step 1: Fetch the order using the orderId
    const order = await Order.findOne({ cashfreeOrderId: orderId });


    if (!order) {
      console.log("❌ Order not found with the given orderId");
      return new NextResponse("Order not found", { status: 404 });
    }

    console.log("📦 Order fetched from DB:", order);

    // Step 2: Fetch payment status from Cashfree
    Cashfree.XClientId = process.env.CASHFREE_APP_ID;  // Replace with your test client ID
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

    let paymentStatus = "Failure"; // Default status

    try {
      const response = await Cashfree.PGOrderFetchPayments("2025-01-01",orderId, order.customerClerkId); 
      console.log("response data is");
      console.log(response.data);// Fetch payments for the order
      const transactions = response.data;
      
      // Determine payment status based on the transactions
      if (transactions.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
        paymentStatus = "Success";
      } else if (transactions.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
        paymentStatus = "Pending";
      } else {
        paymentStatus = "Failure";
      }
      const filteredPayment = transactions.find(transaction => transaction.cf_payment_id); // Find the first valid transaction

if (filteredPayment) {
  order.paymentId = String(filteredPayment.cf_payment_id); // Ensure it's stored as a string
  await order.save(); // Save to the database
}

    } catch (error) {
      console.error("❌ Error fetching payment status from Cashfree:", error);
      return new NextResponse("Error fetching payment status", { status: 500 });
    }

    console.log("📊 Payment Status:", paymentStatus);
   

    if (paymentStatus === "Success") {
      // Step 3: Update the order status to 'Paid'
      order.status = "Paid";
      order.trackingLink="";
      order.cashfreeOrderId=orderId;
      await order.save();
      console.log("✅ Payment successfully verified and order updated!");

      // Step 4: Reduce stock for each product in the order
      for (const cartItem of order.products) {
        console.log("🛍️ Processing Cart Item:", cartItem);

        const size = Array.isArray(cartItem.size) ? cartItem.size[0] : cartItem.size;
        const color = Array.isArray(cartItem.color) ? cartItem.color[0] : cartItem.color;

        console.log("🎨 Color:", color, "| 📏 Size:", size);

        const product = await Product.findById(cartItem.product);

        if (!product) {
          console.error(`❌ Product not found for ID: ${cartItem.product}`);
          continue;
        }

        product.quantity -= cartItem.quantity;

        if (product.quantity <= 0) {
          product.isAvailable = false;
        }

        await product.save();
        console.log(`📉 Updated stock for product ${product._id}: Remaining quantity: ${product.quantity}`);
      }

      console.log("🛒 Product stock updated successfully!");

      // Step 5: Store Customer Details (NEW CODE ADDED)
      const { customerClerkId, customerEmail, customerName } = order;

      if (!customerClerkId || !customerEmail || !customerName) {
        console.warn("⚠️ Missing customer details, skipping customer creation.");
      } else {
        let customer = await Customer.findOne({ clerkId: customerClerkId });

        if (customer) {
          console.log("👤 Customer found, updating order history...");
          customer.orders.push(order._id);
        } else {
          console.log("🆕 Creating a new customer record...");
          customer = new Customer({
            clerkId: customerClerkId,
            name: customerName,
            email: customerEmail,
            orders: [order._id], // Store the order reference
          });
        }

        await customer.save();
        console.log("✅ Customer record updated successfully!");
      }

      // Step 6: Send confirmation email
      if (order.customerEmail) {
        await sendEmail({
          to: order.customerEmail,
          subject: "🛒 Order Confirmation",
          text: `Thank you for your order! Your payment of ₹${order.totalAmount} has been received.`,
          html: `
            <html>
              <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="background-color: #3399cc; padding: 20px; text-align: center;">
                      <h1 style="color: white; font-size: 24px; margin: 0;">Thank You for Your Order!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px;">
                      <p style="font-size: 16px; color: #333333;">Dear ${order.customerName},</p>
                      <p style="font-size: 16px; color: #333333;">Thank you for your order! We're excited to inform you that your payment of <strong>₹${order.totalAmount}</strong> has been successfully received.</p>
                      <p style="font-size: 16px; color: #333333;">Your order details are as follows:</p>
                      <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                        <tr>
                          <td style="font-size: 16px; color: #333333; padding: 8px; border: 1px solid #ddd;">Order ID</td>
                          <td style="font-size: 16px; color: #333333; padding: 8px; border: 1px solid #ddd;">${order._id}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 16px; color: #333333; padding: 8px; border: 1px solid #ddd;">Total Amount</td>
                          <td style="font-size: 16px; color: #333333; padding: 8px; border: 1px solid #ddd;">₹${order.totalAmount}</td>
                        </tr>
                      </table>
                      <p style="font-size: 16px; color: #333333; margin-top: 20px;">We will notify you when your order is shipped. If you have any questions, feel free to reach out to our support team.</p>
                      <p style="font-size: 16px; color: #333333; margin-top: 20px;">Thank you for choosing us!</p>
                      <p style="font-size: 16px; color: #333333;">Best regards,</p>
                      <p style="font-size: 16px; color: #333333;">DrapeAndDime</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 14px; color: #777777;">
                      <p style="margin: 0;">&copy; ${new Date().getFullYear()} DrapeAndDime. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        });

        console.log(`📧 Confirmation email sent to: ${order.customerEmail}`);
      }

      return NextResponse.json({
        success: true,
        message: "Payment verified, order updated, and customer stored",
      }, { status: 200 });

    } else {
      return new NextResponse("Payment verification failed", { status: 400 });
    }

  } catch (error) {
    return new NextResponse("Payment verification failed", { status: 500 });
  }
}
