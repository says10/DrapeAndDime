import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product"; // Import Product model to update stock
import Customer from "@/lib/models/Customer"; // Import Customer model
import { connectToDB } from "@/lib/mongoDB";
import { sendEmail } from "@/lib/email";
import { Cashfree } from "cashfree-pg"; // Import Cashfree
import UsedCoupon from '@/lib/models/UsedCoupon'; // Import UsedCoupon model

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
      return new NextResponse(JSON.stringify({ error: "Missing orderId" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Step 1: Fetch the order using the orderId
    const order = await Order.findOne({ cashfreeOrderId: orderId });


    if (!order) {
      console.log("❌ Order not found with the given orderId");
      return new NextResponse(JSON.stringify({ error: "Order not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
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
      return new NextResponse(JSON.stringify({ error: "Error fetching payment status from Cashfree" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    console.log("📊 Payment Status:", paymentStatus);
   

    if (paymentStatus === "Success") {
      // Step 3: Update the order status to 'Paid'
      order.status = "Paid";
      order.trackingLink="";
      order.cashfreeOrderId=orderId;
      await order.save();
      console.log("✅ Payment successfully verified and order updated!");

      // Mark coupon as used if applicable
      if (order.appliedCoupon && order.customerClerkId && order.appliedCoupon === 'WELCOME5') {
        const alreadyUsed = await UsedCoupon.findOne({ userId: order.customerClerkId, code: 'WELCOME5' });
        if (!alreadyUsed) {
          await UsedCoupon.create({ userId: order.customerClerkId, code: 'WELCOME5' });
          console.log(`🎟️ Marked coupon WELCOME5 as used for user ${order.customerClerkId}`);
        }
      }

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

      console.log("Customer details for creation:", { customerClerkId, customerName, customerEmail });

      if (!customerClerkId || !customerEmail || !customerName) {
        console.warn("⚠️ Missing customer details, skipping customer creation.");
      } else {
        // Try to find by clerkId or email
        let customer = await Customer.findOne({ $or: [ { clerkId: customerClerkId }, { email: customerEmail } ] });
        if (customer) {
          console.log("👤 Customer found, updating order history and details...");
          // Update details if needed
          customer.clerkId = customerClerkId;
          customer.name = customerName;
          customer.email = customerEmail;
          if (!customer.orders.includes(order._id)) {
            customer.orders.push(order._id);
          }
        } else {
          console.log("🆕 Creating a new customer record...");
          customer = new Customer({
            clerkId: customerClerkId,
            name: customerName,
            email: customerEmail,
            orders: [order._id],
          });
        }
        try {
          await customer.save();
          console.log("✅ Customer record updated successfully!");
        } catch (err) {
          console.error("❌ Error saving customer record:", err);
        }
      }

      // Step 6: Send confirmation email
      if (order.customerEmail) {
        // Fetch product details for email
        const productDetails = await Promise.all(
          order.products.map(async (item: any) => {
            const product = await Product.findById(item.product);
            return {
              ...item,
              product: product || { title: 'Product', price: 0 }
            };
          })
        );

        await sendEmail({
          to: order.customerEmail,
          subject: "🎉 Order Confirmed - DrapeAndDime",
          text: `Thank you for your order! Your payment of ₹${order.totalAmount} has been received. Order ID: ${order._id}`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Order Confirmation - DrapeAndDime</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; }
                    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
                    .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
                    .content { padding: 40px 30px; }
                    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
                    .order-details { background-color: #f8f9fa; border-radius: 12px; padding: 25px; margin: 25px 0; }
                    .order-row { display: flex; justify-content: space-between; margin: 12px 0; padding: 8px 0; border-bottom: 1px solid #e9ecef; }
                    .order-row:last-child { border-bottom: none; font-weight: 600; font-size: 18px; color: #2c3e50; }
                    .order-label { color: #6c757d; font-weight: 500; }
                    .order-value { color: #2c3e50; font-weight: 600; }
                    .products-section { margin: 30px 0; }
                    .product-item { display: flex; align-items: center; padding: 15px; background-color: #f8f9fa; border-radius: 8px; margin: 10px 0; }
                    .product-info { flex: 1; margin-left: 15px; }
                    .product-name { font-weight: 600; color: #2c3e50; margin-bottom: 5px; }
                    .product-details { color: #6c757d; font-size: 14px; }
                    .product-price { font-weight: 600; color: #28a745; }
                    .shipping-info { background-color: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; border-radius: 8px; margin: 25px 0; }
                    .shipping-title { font-weight: 600; color: #155724; margin-bottom: 10px; }
                    .shipping-address { color: #155724; line-height: 1.6; }
                    .footer { background-color: #2c3e50; color: white; text-align: center; padding: 30px; }
                    .footer p { margin: 5px 0; }
                    .social-links { margin: 20px 0; }
                    .social-links a { color: white; text-decoration: none; margin: 0 10px; }
                    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 20px 0; }
                    .divider { height: 1px; background-color: #e9ecef; margin: 25px 0; }
                    .total-section { background-color: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; }
                    .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
                    .total-final { font-size: 18px; font-weight: 700; color: #2c3e50; border-top: 2px solid #e9ecef; padding-top: 10px; }
                    @media (max-width: 600px) {
                        .container { margin: 0; }
                        .header, .content, .footer { padding: 20px; }
                        .order-row { flex-direction: column; }
                        .product-item { flex-direction: column; text-align: center; }
                        .product-info { margin: 10px 0 0 0; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Order Confirmed!</h1>
                        <p>Thank you for choosing DrapeAndDime</p>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">
                            Dear <strong>${order.customerName}</strong>,
                        </div>
                        
                        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
                            We're excited to confirm that your order has been successfully placed and your payment of <strong>₹${order.totalAmount}</strong> has been received. 
                            Your order is now being processed and will be shipped soon!
                        </p>
                        
                        <div class="order-details">
                            <h3 style="margin: 0 0 20px 0; color: #2c3e50;">📋 Order Details</h3>
                            <div class="order-row">
                                <span class="order-label">Order ID:</span>
                                <span class="order-value">#${order._id.toString().slice(-8).toUpperCase()}</span>
                            </div>
                            <div class="order-row">
                                <span class="order-label">Order Date:</span>
                                <span class="order-value">${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                            </div>
                            <div class="order-row">
                                <span class="order-label">Payment Status:</span>
                                <span class="order-value" style="color: #28a745;">✅ Paid</span>
                            </div>
                            <div class="order-row">
                                <span class="order-label">Payment ID:</span>
                                <span class="order-value">${order.paymentId || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div class="products-section">
                            <h3 style="margin: 0 0 20px 0; color: #2c3e50;">🛍️ Your Items</h3>
                            ${productDetails.map((item: any) => `
                                <div class="product-item">
                                    <div class="product-info">
                                        <div class="product-name">${item.product.title}</div>
                                        <div class="product-details">
                                            ${item.color && item.color !== 'default' ? `Color: ${item.color} | ` : ''}
                                            ${item.size && item.size !== 'default' ? `Size: ${item.size} | ` : ''}
                                            <span class="product-price">₹${item.product.price} each</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="total-section">
                            <div class="total-row">
                                <span>Subtotal:</span>
                                <span>₹${order.totalAmount}</span>
                            </div>
                            <div class="total-row">
                                <span>Shipping:</span>
                                <span style="color: #28a745;">Free</span>
                            </div>
                            <div class="total-row total-final">
                                <span>Total:</span>
                                <span>₹${order.totalAmount}</span>
                            </div>
                        </div>
                        
                        <div class="shipping-info">
                            <div class="shipping-title">📦 Shipping Address</div>
                            <div class="shipping-address">
                                ${order.shippingAddress?.street}<br>
                                ${order.shippingAddress?.city}, ${order.shippingAddress?.state} ${order.shippingAddress?.postalCode}<br>
                                ${order.shippingAddress?.country}
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="https://drapeanddime.shop" class="cta-button">Continue Shopping</a>
                        </div>
                        
                        <div class="divider"></div>
                        
                        <p style="color: #6c757d; line-height: 1.6; margin-bottom: 20px;">
                            <strong>What's Next?</strong><br>
                            • We'll send you a shipping confirmation email with tracking details<br>
                            • Your order will be carefully packaged and shipped within 1-2 business days<br>
                            • You can track your order status on our website
                        </p>
                        
                        <p style="color: #6c757d; line-height: 1.6;">
                            If you have any questions about your order, please don't hesitate to contact our customer support team. 
                            We're here to help!
                        </p>
                    </div>
                    
                    <div class="footer">
                        <p style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">DrapeAndDime</p>
                        <p style="margin: 5px 0; font-size: 14px;">Your Fashion Destination</p>
                        <div class="social-links">
                            <a href="mailto:drapeanddime@gmail.com">📧 drapeanddime@gmail.com</a>
                        </div>
                        <p style="font-size: 12px; margin-top: 20px; opacity: 0.8;">
                            © ${new Date().getFullYear()} DrapeAndDime. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
          `,
        });

        console.log(`📧 Confirmation email sent to: ${order.customerEmail}`);
      }

      return new NextResponse(JSON.stringify({ success: true, message: "Payment verified and order updated." }), { status: 200, headers: { "Content-Type": "application/json" } });

    } else if (paymentStatus === "Pending") {
      return new NextResponse(JSON.stringify({ success: false, status: "pending", message: "Payment is pending." }), { status: 200, headers: { "Content-Type": "application/json" } });
    } else {
      return new NextResponse(JSON.stringify({ success: false, message: "Payment verification failed." }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

  } catch (error) {
    return new NextResponse("Payment verification failed", { status: 500 });
  }
}
