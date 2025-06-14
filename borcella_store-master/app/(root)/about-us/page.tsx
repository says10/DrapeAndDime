import React from "react";

const About: React.FC = () => {
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.pageContainer}>
        {/* Hero Section */}
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>
            Welcome to <span style={styles.brandName}>Drape & Dime</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Where style meets comfort, and trends meet affordability.
          </p>
        </section>

        {/* About Us Content */}
        <div style={styles.contentContainer}>
          <h2 style={styles.sectionTitle}>Our Story</h2>
          <p style={styles.paragraph}>
            At <strong>Drape & Dime</strong>, we are more than just a fashion brand. We are a movement, redefining
            style with a perfect blend of elegance and affordability. Every piece we offer is handpicked to ensure
            premium quality, comfort, and an effortless fashion statement.
          </p>

          {/* Core Values Section */}
          <h2 style={styles.sectionTitle}>What We Stand For</h2>
          <div style={styles.valuesContainer}>
            <div style={styles.valueCard}>
              <h3>🌱 Sustainability</h3>
              <p>Eco-friendly materials and ethical sourcing are at our core.</p>
            </div>
            <div style={styles.valueCard}>
              <h3>🔍 Attention to Detail</h3>
              <p>Every stitch, fabric, and fit is crafted to perfection.</p>
            </div>
            <div style={styles.valueCard}>
              <h3>💖 Customer First</h3>
              <p>Your happiness is our success. We strive for top-tier service.</p>
            </div>
          </div>

          {/* Why Choose Us */}
          <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
          <ul style={styles.list}>
            <li>✅ Trendsetting designs that blend tradition and modernity.</li>
            <li>✅ Fast and hassle-free shipping.</li>
            <li>✅ Affordable pricing with uncompromised quality.</li>
            <li>✅ Secure and seamless shopping experience.</li>
          </ul>

          {/* Contact Section */}
          <h2 style={styles.sectionTitle}>Get in Touch</h2>
          <div style={styles.contactContainer}>
            <a href="mailto:drapeanddime@gmail.com" style={styles.contactItem}>
              <img src="/gmail.svg" alt="Gmail" style={styles.icon} />
              drapeanddime@gmail.com
            </a>
            <a
              href="https://www.instagram.com/drapeanddime?igsh=bjZyM3E2dHZzMDBs"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.contactItem}
            >
              <img src="/instagram.svg" alt="Instagram" style={styles.icon} />
              @drapeanddime
            </a>
          </div>

          {/* Return Policy */}
          <h2 style={styles.sectionTitle}>Return Policy</h2>
          <p style={styles.paragraph}>
            We want you to love your purchase! If you're not satisfied, you can <strong>return your item within 2 days</strong>.
          </p>
          <p style={styles.paragraph}>
            📩 To initiate a return, email us at
            <a href="mailto:drapeanddime@gmail.com" style={styles.emailLink}> drapeanddime@gmail.com</a>.
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
  valuesContainer: {
    display: "flex",
    gap: "15px",
    justifyContent: "space-between",
    flexWrap: "wrap", // ✅ Responsiveness
    marginTop: "20px",
  },
  valueCard: {
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    flex: "1",
    textAlign: "center",
    minWidth: "200px",
  },
  list: {
    padding: "0",
    marginLeft: "20px",
    fontSize: "16px",
    lineHeight: "1.6",
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
  emailLink: {
    color: "#0077cc",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default About;
