// Helper to ensure absolute image URLs
function getAbsoluteImageUrl(image: string) {
  if (!image) return '';
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${process.env.NEXT_PUBLIC_APP_URL}${image.startsWith('/') ? '' : '/'}${image}`;
}

export const cartAbandonmentTemplates = {
  // 1 hour abandonment - gentle reminder
  abandonment_1h: (userName: string, cartItems: any[], totalValue: number) => ({
    subject: `Complete your purchase, ${userName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Purchase</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; }
          .logo { max-width: 150px; }
          .cart-items { margin: 20px 0; }
          .cart-item { display: flex; align-items: center; padding: 15px; border: 1px solid #eee; margin: 10px 0; border-radius: 8px; }
          .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
          .item-details { flex: 1; }
          .item-title { font-weight: bold; margin-bottom: 5px; }
          .item-price { color: #666; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; }
          .cta-button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Logo" class="logo">
            <h1>Hey ${userName}!</h1>
            <p>We noticed you left some items in your cart. Don't let them get away!</p>
          </div>
          
          <div class="cart-items">
            <h2>Your Cart Items:</h2>
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
              Total: ₹${totalValue.toFixed(2)}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://drapeanddime.shop/cart" class="cta-button">
              Complete Your Purchase
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@drapeanddime.com</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; }
          .logo { max-width: 150px; }
          .urgency { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .cart-items { margin: 20px 0; }
          .cart-item { display: flex; align-items: center; padding: 15px; border: 1px solid #eee; margin: 10px 0; border-radius: 8px; }
          .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
          .item-details { flex: 1; }
          .item-title { font-weight: bold; margin-bottom: 5px; }
          .item-price { color: #666; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; }
          .cta-button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Logo" class="logo">
            <h1>${userName}, your cart is getting lonely!</h1>
          </div>
          
          <div class="urgency">
            <strong>⏰ Don't wait too long!</strong> These items might not be available forever.
          </div>
          
          <div class="cart-items">
            <h2>Your Cart Items:</h2>
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
              Total: ₹${totalValue.toFixed(2)}
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://drapeanddime.shop/cart" class="cta-button">
              Complete Your Purchase Now
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@drapeanddime.com</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 20px 0; }
          .logo { max-width: 150px; }
          .offer { background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .discount { font-size: 24px; font-weight: bold; color: #155724; }
          .cart-items { margin: 20px 0; }
          .cart-item { display: flex; align-items: center; padding: 15px; border: 1px solid #eee; margin: 10px 0; border-radius: 8px; }
          .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; margin-right: 15px; }
          .item-details { flex: 1; }
          .item-title { font-weight: bold; margin-bottom: 5px; }
          .item-price { color: #666; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; }
          .savings { color: #155724; font-weight: bold; }
          .cta-button { display: inline-block; background: #000; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Logo" class="logo">
            <h1>${userName}, this is your final chance!</h1>
          </div>
          
          <div class="offer">
            <div class="discount">🎉 10% OFF YOUR CART!</div>
            <p>Use code: <strong>SAVE10</strong> at checkout</p>
            <p>This offer expires in 24 hours!</p>
          </div>
          
          <div class="cart-items">
            <h2>Your Cart Items:</h2>
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
              Original Total: ₹${totalValue.toFixed(2)}<br>
              <span class="savings">With 10% off: ₹${(totalValue * 0.9).toFixed(2)}</span><br>
              <span class="savings">You save: ₹${(totalValue * 0.1).toFixed(2)}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://drapeanddime.shop/cart" class="cta-button">
              Claim Your Discount Now
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@drapeanddime.com</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
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
            <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png" alt="Logo" class="logo">
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
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders" class="cta-button">
              View Your Orders
            </a>
          </div>
          
          <div class="footer">
            <p>Questions? Contact us at support@drapeanddime.com</p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">Unsubscribe</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  })
}; 