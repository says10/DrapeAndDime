export async function trackCartSession({
  action,
  cartItems = [],
  userEmail = '',
  userName = ''
}: {
  action: 'create_session' | 'update_activity' | 'mark_abandoned' | 'mark_recovered' | 'mark_purchased' | 'clear_session' | 'update_session',
  cartItems?: any[],
  userEmail?: string,
  userName?: string
}) {
  try {
    const res = await fetch('/api/cart-tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, cartItems, userEmail, userName })
    });
    return await res.json();
  } catch (error) {
    console.error('Cart tracking error:', error);
    return null;
  }
} 