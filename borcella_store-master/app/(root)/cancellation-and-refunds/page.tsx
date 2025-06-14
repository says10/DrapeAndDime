import React from "react";

const Refund: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Refund and Cancellation Policy</h1>
      <p>Last updated: 21/03/2025</p>

      <h2 style={styles.subTitle}>1. Cancellation Policy</h2>
      <p>Cancellations will be considered only if requested on the same day of placing the order. However, cancellations may not be entertained if the order has already been processed for shipping.</p>
      <p>Orders for perishable items like flowers and eatables are not eligible for cancellation. However, if the quality of the product is found to be unsatisfactory, a refund or replacement can be issued.</p>

      <h2 style={styles.subTitle}>2. Return Eligibility</h2>
      <p>Returns are accepted if the product is unused, unopened, and in its original packaging. The return request must be made within <strong>24 hours</strong> of receiving the item.</p>
      <p>Damaged or used items will not be eligible for return.</p>

      <h2 style={styles.subTitle}>3. Refund Process</h2>
      <p>Refunds will be processed within <strong>3-4 business days</strong> after approval. The amount will be credited back to the original payment method.</p>
      <p>Shipping charges are non-refundable, and customers will bear return shipping costs unless the return is due to a defect or an error on our part.</p>

      <h2 style={styles.subTitle}>4. Damaged or Defective Items</h2>
      <p>If you receive a damaged or defective product, please contact us within the same day at <a href="mailto:drapeanddime@gmail.com" style={styles.link}>drapeanddime@gmail.com</a> with photos of the damage.</p>
      <p>The issue will be verified, and if approved, a replacement or refund will be processed accordingly.</p>

      <h2 style={styles.subTitle}>5. Product Warranty Issues</h2>
      <p>For complaints related to products that come with a manufacturer’s warranty, please refer the issue directly to the manufacturer.</p>

      <h2 style={styles.subTitle}>6. How to Initiate a Return or Cancellation</h2>
      <p>To request a return, cancellation, or refund, please email us at <a href="mailto:drapeanddime@gmail.com" style={styles.link}>drapeanddime@gmail.com</a> with your order details and reason for the request.</p>
      <p>Our customer support team will assist you in resolving the issue promptly.</p>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  pageContainer: {
    padding: "40px",
    maxWidth: "800px",
    margin: "auto",
    fontFamily: "Poppins, sans-serif",
    backgroundImage: "url('/background2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#555",
  },
  title: { fontSize: "28px", fontWeight: "bold", marginBottom: "20px", textAlign: "center" },
  subTitle: { fontSize: "22px", fontWeight: "bold", marginTop: "20px" },
  list: { padding: "0 20px", fontSize: "16px", lineHeight: "1.6" },
  link: { color: "#0077cc", textDecoration: "none", fontWeight: "bold" },
};

export default Refund;
