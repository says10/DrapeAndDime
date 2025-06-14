import React from "react";

const Shipping: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Shipping Policy</h1>
      <p>Last updated: 21/03/2025</p>

      <h2 style={styles.subTitle}>Order Processing</h2>
      <p>Orders are processed within <strong>0-7 days</strong> from the order confirmation and payment, or as per the delivery date agreed upon at the time of order confirmation.</p>

      <h2 style={styles.subTitle}>Delivery Time</h2>
      <p>For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.</p>
      <p>For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only. Delivery is subject to Courier Company or post office norms.</p>
      <p>Delivery may take up to <strong>7 days</strong>, but unforeseen circumstances may cause delays.</p>

      <h2 style={styles.subTitle}>Shipping Charges</h2>
      <p>Shipping charges vary based on the delivery location and will be displayed at checkout.</p>

      <h2 style={styles.subTitle}>Tracking</h2>
      <p>Once shipped, you will receive a tracking link via email to track your order.</p>

      <h2 style={styles.subTitle}>Undeliverable Orders</h2>
      <p>If a package is returned due to incorrect details provided by the buyer, the customer will be responsible for re-shipping charges.</p>

      <p>
        For shipping inquiries or any assistance, feel free to contact us at 
        <a href="mailto:drapeanddime@gmail.com" style={styles.link}> drapeanddime@gmail.com</a> or call us at <strong>8910607304</strong>.
      </p>

      <h2 style={styles.subTitle}>Disclaimer</h2>
      <p>SAYANTAN MUKHERJEE is not liable for any delay in delivery by the courier company or postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within the processing time.</p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageContainer: { padding: "40px", maxWidth: "800px", margin: "auto", fontFamily: "Poppins, sans-serif" },
  title: { fontSize: "28px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
  subTitle: { fontSize: "22px", fontWeight: "bold", marginTop: "20px" },
  list: { padding: "0 20px", fontSize: "16px", lineHeight: "1.6" },
  link: { color: "#0077cc", textDecoration: "none", fontWeight: "bold" },
};

export default Shipping;
