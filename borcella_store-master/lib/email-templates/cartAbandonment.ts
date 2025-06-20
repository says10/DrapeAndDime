// Helper to ensure absolute image URLs
function getAbsoluteImageUrl(image: string) {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${process.env.ECOMMERCE_STORE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

export const cartAbandonmentTemplates = {
  // 1 hour abandonment - gentle reminder
  abandonment_1h: (userName: string, cartItems: any[], totalValue: number) => ({
    subject: `Still thinking it over, ${userName}? Your cart is waiting!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Purchase</title>
        <style>
          body { background: #f7f7fa; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #222; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 32px 24px; }
          .header { text-align: center; padding: 0 0 20px 0; }
          .logo { max-width: 120px; margin-bottom: 12px; }
          .headline { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #111; }
          .subtext { color: #666; font-size: 16px; margin-bottom: 18px; }
          .cart-items { margin: 24px 0; }
          .cart-item { display: flex; align-items: center; padding: 14px; border: 1px solid #eee; margin: 10px 0; border-radius: 10px; background: #fafbfc; }
          .item-image { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-right: 18px; border: 1px solid #e5e7eb; }
          .item-details { flex: 1; }
          .item-title { font-weight: 600; margin-bottom: 4px; color: #222; }
          .item-price { color: #888; font-size: 15px; }
          .total { font-size: 20px; font-weight: bold; text-align: right; margin: 24px 0 0 0; color: #111; }
          .cta-button { display: inline-block; background: linear-gradient(90deg, #7f5af0 0%, #2cb67d 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 32px 0 0 0; box-shadow: 0 2px 8px rgba(127,90,240,0.08); transition: background 0.2s; }
          .cta-button:hover { background: linear-gradient(90deg, #2cb67d 0%, #7f5af0 100%); }
          .footer { text-align: center; margin-top: 36px; color: #888; font-size: 14px; }
          .testimonial { background: #f0f4ff; border-left: 4px solid #7f5af0; padding: 16px 20px; border-radius: 8px; margin: 24px 0 0 0; font-style: italic; color: #444; }
          .support-link { color: #7f5af0; text-decoration: underline; }
          .fallback-link { display: block; margin-top: 12px; color: #2cb67d; font-size: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${getAbsoluteImageUrl('/logo.png')}" alt="Drape & Dime Logo" class="logo">
            <div class="headline">Hey ${userName}, you left something behind!</div>
            <div class="subtext">Your cart is waiting for you. These items are almost yours—come back and finish your order!</div>
          </div>
          <div class="cart-items">
            ${cartItems.map(item => `
              <div class="cart-item">
                <img src="${getAbsoluteImageUrl(item.image)}" alt="${item.title}" class="item-image">
                <div class="item-details">
                  <div class="item-title">${item.title}</div>
                  <div class="item-price">₹${item.price} x ${item.quantity}</div>
                </div>
              </div>
            `).join('')}
            <div class="total">
              Cart Total: ₹${totalValue.toFixed(2)}
            </div>
          </div>
          <div style="text-align: center;">
            <a href="https://drapeanddime.shop/cart" class="cta-button">Complete Your Purchase</a>
            <span class="fallback-link">or <a href="https://drapeanddime.shop/cart">view your cart</a></span>
          </div>
          <div class="testimonial">
            "Absolutely love the quality and service! My order arrived quickly and the products were even better than expected."<br>
            <span style="font-size:13px; color:#7f5af0;">– Happy Drape & Dime Customer</span>
          </div>
          <div class="footer">
            <p>Need help? <a href="mailto:support@drapeanddime.com" class="support-link">Contact our support team</a></p>
            <p><a href="${process.env.ECOMMERCE_STORE_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // 24 hour abandonment - add urgency
  abandonment_24h: (userName: string, cartItems: any[], totalValue: number) => ({
    subject: `Your cart is waiting for you, ${userName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Cart is Waiting</title>
        <style>
          body { background: #f7f7fa; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #222; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 32px 24px; }
          .header { text-align: center; padding: 0 0 20px 0; }
          .logo { max-width: 120px; margin-bottom: 12px; }
          .headline { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #111; }
          .urgency { background: #fff3cd; border: 1px solid #ffeaa7; padding: 16px 20px; border-radius: 8px; margin: 20px 0; font-size: 16px; color: #856404; text-align: center; }
          .cart-items { margin: 24px 0; }
          .cart-item { display: flex; align-items: center; padding: 14px; border: 1px solid #eee; margin: 10px 0; border-radius: 10px; background: #fafbfc; }
          .item-image { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-right: 18px; border: 1px solid #e5e7eb; }
          .item-details { flex: 1; }
          .item-title { font-weight: 600; margin-bottom: 4px; color: #222; }
          .item-price { color: #888; font-size: 15px; }
          .total { font-size: 20px; font-weight: bold; text-align: right; margin: 24px 0 0 0; color: #111; }
          .cta-button { display: inline-block; background: linear-gradient(90deg, #ff8906 0%, #f25f4c 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 32px 0 0 0; box-shadow: 0 2px 8px rgba(242,95,76,0.08); transition: background 0.2s; }
          .cta-button:hover { background: linear-gradient(90deg, #f25f4c 0%, #ff8906 100%); }
          .footer { text-align: center; margin-top: 36px; color: #888; font-size: 14px; }
          .testimonial { background: #f0f4ff; border-left: 4px solid #7f5af0; padding: 16px 20px; border-radius: 8px; margin: 24px 0 0 0; font-style: italic; color: #444; }
          .support-link { color: #7f5af0; text-decoration: underline; }
          .fallback-link { display: block; margin-top: 12px; color: #f25f4c; font-size: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${getAbsoluteImageUrl('/logo.png')}" alt="Drape & Dime Logo" class="logo">
            <div class="headline">${userName}, your cart is getting lonely!</div>
          </div>
          <div class="urgency">
            <strong>⏰ Don't wait too long!</strong> These items might not be available forever. Complete your purchase before they're gone.
          </div>
          <div class="cart-items">
            ${cartItems.map(item => `
              <div class="cart-item">
                <img src="${getAbsoluteImageUrl(item.image)}" alt="${item.title}" class="item-image">
                <div class="item-details">
                  <div class="item-title">${item.title}</div>
                  <div class="item-price">₹${item.price} x ${item.quantity}</div>
                </div>
              </div>
            `).join('')}
            <div class="total">
              Cart Total: ₹${totalValue.toFixed(2)}
            </div>
          </div>
          <div style="text-align: center;">
            <a href="https://drapeanddime.shop/cart" class="cta-button">Return to Your Cart</a>
            <span class="fallback-link">or <a href="https://drapeanddime.shop/cart">view your cart</a></span>
          </div>
          <div class="testimonial">
            "I almost forgot my cart, but the reminder email made it so easy to finish my order. Great experience!"<br>
            <span style="font-size:13px; color:#7f5af0;">– Satisfied Customer</span>
          </div>
          <div class="footer">
            <p>Need help? <a href="mailto:support@drapeanddime.com" class="support-link">Contact our support team</a></p>
            <p><a href="${process.env.ECOMMERCE_STORE_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // 72 hour abandonment - final offer with discount
  abandonment_72h: (userName: string, cartItems: any[], totalValue: number) => ({
    subject: `Last chance: 10% off your cart, ${userName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Last Chance - 10% Off!</title>
        <style>
          body { background: #f7f7fa; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #222; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); padding: 32px 24px; }
          .header { text-align: center; padding: 0 0 20px 0; }
          .logo { max-width: 120px; margin-bottom: 12px; }
          .headline { font-size: 28px; font-weight: 700; margin: 0 0 8px 0; color: #111; }
          .offer { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .discount { font-size: 24px; font-weight: bold; color: #198754; }
          .cart-items { margin: 24px 0; }
          .cart-item { display: flex; align-items: center; padding: 14px; border: 1px solid #eee; margin: 10px 0; border-radius: 10px; background: #fafbfc; }
          .item-image { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; margin-right: 18px; border: 1px solid #e5e7eb; }
          .item-details { flex: 1; }
          .item-title { font-weight: 600; margin-bottom: 4px; color: #222; }
          .item-price { color: #888; font-size: 15px; }
          .total { font-size: 20px; font-weight: bold; text-align: right; margin: 24px 0 0 0; color: #111; }
          .cta-button { display: inline-block; background: linear-gradient(90deg, #2cb67d 0%, #7f5af0 100%); color: white; padding: 16px 36px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 32px 0 0 0; box-shadow: 0 2px 8px rgba(44,182,125,0.08); transition: background 0.2s; }
          .cta-button:hover { background: linear-gradient(90deg, #7f5af0 0%, #2cb67d 100%); }
          .footer { text-align: center; margin-top: 36px; color: #888; font-size: 14px; }
          .testimonial { background: #f0f4ff; border-left: 4px solid #7f5af0; padding: 16px 20px; border-radius: 8px; margin: 24px 0 0 0; font-style: italic; color: #444; }
          .support-link { color: #7f5af0; text-decoration: underline; }
          .fallback-link { display: block; margin-top: 12px; color: #2cb67d; font-size: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${getAbsoluteImageUrl('/logo.png')}" alt="Drape & Dime Logo" class="logo">
            <div class="headline">${userName}, this is your final chance!</div>
          </div>
          <div class="offer">
            <div class="discount">🎉 10% OFF YOUR CART!</div>
            <p>Use code: <strong>SAVE10</strong> at checkout</p>
            <p>This offer expires in 24 hours!</p>
          </div>
          <div class="cart-items">
            ${cartItems.map(item => `
              <div class="cart-item">
                <img src="${getAbsoluteImageUrl(item.image)}" alt="${item.title}" class="item-image">
                <div class="item-details">
                  <div class="item-title">${item.title}</div>
                  <div class="item-price">₹${item.price} x ${item.quantity}</div>
                </div>
              </div>
            `).join('')}
            <div class="total">
              Cart Total: ₹${totalValue.toFixed(2)}
            </div>
          </div>
          <div style="text-align: center;">
            <a href="https://drapeanddime.shop/cart" class="cta-button">Get My 10% Off & Checkout</a>
            <span class="fallback-link">or <a href="https://drapeanddime.shop/cart">view your cart</a></span>
          </div>
          <div class="testimonial">
            "The 10% off was the nudge I needed! Super easy checkout and fast delivery. Highly recommend Drape & Dime."<br>
            <span style="font-size:13px; color:#7f5af0;">– Verified Buyer</span>
          </div>
          <div class="footer">
            <p>Need help? <a href="mailto:support@drapeanddime.com" class="support-link">Contact our support team</a></p>
            <p><a href="${process.env.ECOMMERCE_STORE_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  // Recovery email - after successful purchase
  recovery: (userName: string, orderNumber: string, totalValue: number) => ({
    subject: `Thank you for your purchase, ${userName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Your Purchase</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; }
          .logo { max-width: 150px; }
          .thank-you { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .order-details { margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
          .cta-button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.ECOMMERCE_STORE_URL}/logo.png" alt="Logo" class="logo">
            <h1>Thank you, ${userName}!</h1>
          </div>
          
          <div class="thank-you">
            <h2>🎉 Your order has been confirmed!</h2>
            <p>We're so glad you completed your purchase. Your items are being prepared for shipping.</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> ₹${totalValue.toFixed(2)}</p>
            <p>You'll receive a shipping confirmation email once your order is on its way.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ECOMMERCE_STORE_URL}/orders" class="cta-button">
              View Your Orders
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@drapeanddime.com</p>
            <p><a href="${process.env.ECOMMERCE_STORE_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}; 