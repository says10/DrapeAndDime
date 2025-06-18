import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product"; // Import Product model to update stock
import Customer from "@/lib/models/Customer"; // Import Customer model
import { connectToDB } from "@/lib/mongoDB";
import { sendEmail } from "@/lib/email";
import { Cashfree } from "cashfree-pg"; // Import Cashfree

const allowedOrigin = `https://drapeanddime.shop`;

// Add this type at the top of the file or near the function

type CashfreeTransaction = {
  cf_payment_id: string;
  payment_status: string;
  payment_amount: number;
  payment_currency: string;
  payment_time: string;
  // Add more fields if needed
};

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

// Helper function to create timeout promise
const createTimeoutPromise = (ms: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), ms);
  });
};

// Helper function to fetch order payments with timeout
const fetchOrderPaymentsWithTimeout = async (orderId: string, customerId: string, timeoutMs = 10000) => {
  try {
    const paymentsPromise = Cashfree.PGOrderFetchPayments("2025-01-01", orderId, customerId);
    const timeoutPromise = createTimeoutPromise(timeoutMs);
    
    const response = await Promise.race([paymentsPromise, timeoutPromise]);
    return response;
  } catch (error: any) {
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    console.log("🔐 Verifying Cashfree Payment");
    console.log("🌍 Request Origin:", req.headers.get("origin"));

    await connectToDB();

    const body = await req.json();
    console.log("📩 Received payment verification request body:", body);

    const { orderId, paymentId } = body;

    // Validate input
    if (!orderId) {
      console.log("❌ Missing orderId. Verification cannot proceed.");
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Missing orderId" 
        }), 
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    // Step 1: Fetch the order using the orderId
    const order = await Order.findOne({ cashfreeOrderId: orderId });

    if (!order) {
      console.log("❌ Order not found with the given orderId:", orderId);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Order not found" 
        }), 
        { 
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    console.log("📦 Order fetched from DB:", {
      orderId: order._id,
      cashfreeOrderId: order.cashfreeOrderId,
      status: order.status,
      totalAmount: order.totalAmount
    });

    // Check if order is already paid
    if (order.status === "Paid") {
      console.log("⚠️ Order is already marked as paid, returning success");
      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Order already processed",
          orderId: order._id,
          paymentId: order.paymentId,
        }), 
        { 
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    // Step 2: Initialize Cashfree
    Cashfree.XClientId = process.env.CASHFREE_APP_ID;
    Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
    Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

    let paymentStatus = "Failure";
    let paymentDetails = null;

    try {
      // Fetch payments using orderId
      console.log("🔍 Fetching payments using orderId:", orderId);
      console.log("🔍 Customer Clerk ID:", order.customerClerkId);
      
      const response = await fetchOrderPaymentsWithTimeout(orderId, order.customerClerkId, 8000) as any;
      console.log("📊 Order payments response status:", response.status);
      console.log("📊 Order payments response data:", JSON.stringify(response.data, null, 2));
      
      const transactions = (response.data || []) as CashfreeTransaction[];
      console.log("📊 Number of transactions found:", transactions.length);
      
      if (transactions.length > 0) {
        // Log all transaction statuses for debugging
        transactions.forEach((transaction: CashfreeTransaction, index: number) => {
          console.log(`📊 Transaction ${index + 1}:`, {
            cf_payment_id: transaction.cf_payment_id,
            payment_status: transaction.payment_status,
            payment_amount: transaction.payment_amount,
            payment_currency: transaction.payment_currency,
            payment_time: transaction.payment_time
          });
        });
        
        // Find the most recent successful payment
        const successfulPayment = transactions.find(transaction => 
          transaction.payment_status === "SUCCESS"
        );
        
        if (successfulPayment) {
          paymentStatus = "Success";
          paymentDetails = successfulPayment;
          order.paymentId = String(successfulPayment.cf_payment_id);
          await order.save();
          console.log("✅ Payment status determined from order payments: Success");
        } else {
          // Check for pending payments
          const pendingPayment = transactions.find(transaction => 
            transaction.payment_status === "PENDING"
          );
          
          if (pendingPayment) {
            paymentStatus = "Pending";
            paymentDetails = pendingPayment;
            console.log("⏳ Payment status: Pending");
          } else {
            // Check for failed payments
            const failedPayment = transactions.find(transaction => 
              transaction.payment_status === "FAILED"
            );
            
            if (failedPayment) {
              paymentStatus = "Failed";
              paymentDetails = failedPayment;
              console.log("❌ Payment status: Failed");
            } else {
              paymentStatus = "Failure";
              console.log("❌ No successful, pending, or failed payments found");
            }
          }
        }
      } else {
        console.log("❌ No transactions found for this order");
      }

    } catch (error: any) {
      console.error("❌ Error fetching payment status from Cashfree:", error);
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: "Error fetching payment status from payment gateway",
          error: error?.message || "Unknown error"
        }), 
        { 
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    console.log("📊 Final Payment Status:", paymentStatus);

    if (paymentStatus === "Success") {
      // Step 3: Update the order status to 'Paid'
      order.status = "Paid";
      order.trackingLink = "";
      order.cashfreeOrderId = orderId;
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

        // Check if we have enough stock before reducing
        if (product.quantity < cartItem.quantity) {
          console.error(`❌ Insufficient stock for product ${product._id}: Required ${cartItem.quantity}, Available ${product.quantity}`);
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

      // Step 5: Store Customer Details
      const { customerClerkId, customerEmail, customerName } = order;

      if (!customerClerkId || !customerEmail || !customerName) {
        console.warn("⚠️ Missing customer details, skipping customer creation.");
      } else {
        let customer = await Customer.findOne({ clerkId: customerClerkId });

        if (customer) {
          console.log("👤 Customer found, updating order history...");
          // Check if order is already in customer's orders
          if (!customer.orders.includes(order._id)) {
            customer.orders.push(order._id);
            await customer.save();
          }
        } else {
          console.log("🆕 Creating a new customer record...");
          customer = new Customer({
            clerkId: customerClerkId,
            name: customerName,
            email: customerEmail,
            orders: [order._id],
          });
          await customer.save();
        }

        console.log("✅ Customer record updated successfully!");
      }

      // Step 6: Send confirmation email
      if (order.customerEmail) {
        try {
          await sendEmail({
            to: order.customerEmail,
            subject: "🛒 Order Confirmation - DrapeAndDime",
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
                          <tr>
                            <td style="font-size: 16px; color: #333333; padding: 8px; border: 1px solid #ddd;">Payment ID</td>
                            <td style="font-size: 16px; color: #333333; padding: 8px; border: 1px solid #ddd;">${order.paymentId || 'N/A'}</td>
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
        } catch (emailError: any) {
          console.error("❌ Error sending confirmation email:", emailError);
          // Don't fail the entire process if email fails
        }
      }

      return new NextResponse(
        JSON.stringify({
          success: true,
          message: "Payment verified, order updated, and customer stored",
          orderId: order._id,
          paymentId: order.paymentId,
        }), 
        { 
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );

    } else if (paymentStatus === "Pending") {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Payment is pending, please wait for confirmation",
          status: "pending"
        }), 
        { 
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    } else {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: "Payment verification failed - payment not successful",
          status: "failed",
          paymentStatus: paymentStatus
        }), 
        { 
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": allowedOrigin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

  } catch (error: any) {
    console.error("❌ [verifypayment_POST] Error:", error);
    return new NextResponse(
      JSON.stringify({ 
        success: false, 
        message: "Internal Server Error",
        error: error?.message || "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": allowedOrigin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Credentials": "true",
        },
      }
    );
  }
}
