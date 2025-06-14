import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.pageContainer}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Get in Touch with <span style={styles.brandName}>Drape & Dime</span>
          </h1>
          <p style={styles.heroSubtitle}>
            We’re here to help! Reach out for support, inquiries, or collaborations.
          </p>
        </section>

        {/* Contact Information */}
        <div style={styles.contentContainer}>
          <h2 style={styles.sectionTitle}>Contact Details</h2>
          <p style={styles.paragraph}>
            Have questions? We’d love to hear from you! Feel free to reach us through any of the options below.
          </p>

          <div style={styles.contactContainer}>
            <a href="mailto:drapeanddime@gmail.com" style={styles.contactItem}>
              <img src="/gmail.svg" alt="Gmail" style={styles.icon} />
              drapeanddime@gmail.com
            </a>
            <a href="tel:+918910607304" style={styles.contactItem}>
              <img src="/phone.svg" alt="Phone" style={styles.icon} />
              +91 8910607304
            </a>
          </div>

          {/* Business Information */}
          <h2 style={styles.sectionTitle}>Business Information</h2>
          <p style={styles.paragraph}><strong>Legal Name:</strong> SAYANTAN MUKHERJEE</p>
          <p style={styles.paragraph}><strong>Operating Address:</strong> 108 Pallisree Regent Estate Kolkata, West Bengal, 700092</p>

          {/* Customer Support */}
          <h2 style={styles.sectionTitle}>Customer Support</h2>
          <p style={styles.paragraph}>
            Our support team is available Monday to Saturday, 10:00 AM - 6:00 PM IST.
          </p>

          {/* FAQs Section */}
          <h2 style={styles.sectionTitle}>FAQs</h2>
          <p style={styles.paragraph}>
            Check our <a href="/faqs" style={styles.link}>FAQs page</a> for common queries about orders, shipping, and returns.
          </p>
        </div>
      </div>
    </div>
  );
};

// ✅ TypeScript Fix: Defined styles with React.CSSProperties
const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    backgroundImage: "url('/background2.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px 20px",
  },
  pageContainer: {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: "#ffffff",
    padding: "40px 20px",
    maxWidth: "1000px",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
  },
  heroSection: {
    textAlign: "center",
    padding: "30px 20px",
    backgroundColor: "#222",
    color: "white",
    borderRadius: "8px",
  },
  heroTitle: {
    fontSize: "36px",
    fontWeight: "bold",
  },
  brandName: {
    color: "#ff6600",
  },
  heroSubtitle: {
    fontSize: "18px",
    marginTop: "10px",
  },
  contentContainer: {
    padding: "30px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "15px",
    color: "#555",
  },
  contactContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "10px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: "16px",
    color: "#333",
    transition: "color 0.3s ease",
  },
  icon: {
    width: "24px",
    height: "24px",
    marginRight: "8px",
  },
  link: {
    color: "#0077cc",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default ContactUs;
