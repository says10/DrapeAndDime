import React from "react";

const Terms: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Terms and Conditions</h1>
      <p>Last updated: March 21, 2025</p>

      <p>
        Welcome to <strong>Drape & Dime</strong>. By accessing and using our website, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
      </p>

      <h3 style={styles.sectionTitle}>1. General Terms</h3>
      <p>
        For the purpose of these Terms and Conditions, the terms "we," "us," and "our" refer to SAYANTAN MUKHERJEE, whose registered/operational office is at 108 Pallisree Regent Estate, Kolkata, West Bengal, 700092. The terms "you," "your," "user," and "visitor" refer to any natural or legal person who is visiting our website and/or agreeing to purchase from us.
      </p>
      <p>
        Your use of the website and/or purchase from us is governed by the following Terms and Conditions.
      </p>

      <h3 style={styles.sectionTitle}>2. Website Content</h3>
      <p>
        The content of the pages of this website is subject to change without notice. Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website for any particular purpose.
      </p>
      <p>
        You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
      </p>

      <h3 style={styles.sectionTitle}>3. Use of Information</h3>
      <p>
        Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through our website and/or product pages meet your specific requirements.
      </p>

      <h3 style={styles.sectionTitle}>4. Intellectual Property</h3>
      <p>
        Our website contains material owned by or licensed to us. This includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
      </p>
      <p>
        All trademarks reproduced on our website that are not the property of or licensed to the operator are acknowledged on the website.
      </p>

      <h3 style={styles.sectionTitle}>5. Unauthorized Use</h3>
      <p>
        Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.
      </p>

      <h3 style={styles.sectionTitle}>6. Third-Party Links</h3>
      <p>
        From time to time, our website may also include links to other websites. These links are provided for your convenience to offer further information.
      </p>
      <p>
        You may not create a link to our website from another website or document without SAYANTAN MUKHERJEE’s prior written consent.
      </p>

      <h3 style={styles.sectionTitle}>7. Payment and Transactions</h3>
      <p>
        Payments for products on our website are securely processed through Razorpay. By purchasing through our website, you agree to comply with Razorpay’s terms of service, which govern the payment process.
      </p>
      <p>
        We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.
      </p>

      <h3 style={styles.sectionTitle}>8. Dispute Resolution</h3>
      <p>
        Any dispute arising out of your use of our website, purchase from us, or any engagement with us is subject to the laws of India. You agree to submit to the jurisdiction of the courts located in India.
      </p>

      <h3 style={styles.sectionTitle}>9. Contact Us</h3>
      <p>
        If you have any questions or concerns regarding these Terms and Conditions, please contact us at <a href="mailto:drapeanddime@gmail.com" style={styles.link}>drapeanddime@gmail.com</a>.
      </p>
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
  sectionTitle: { fontSize: "20px", fontWeight: "bold", marginTop: "20px" },
  list: { padding: "0 20px", fontSize: "16px", lineHeight: "1.6" },
  link: { color: "#0077cc", textDecoration: "none", fontWeight: "bold" },
};

export default Terms;
