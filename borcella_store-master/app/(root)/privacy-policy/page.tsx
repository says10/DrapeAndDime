import React from "react";

const Privacy: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.title}>Privacy Policy</h1>
      <p>Last updated: 21/03/2025</p>

      <p>
        This privacy policy sets out how <strong>SAYANTAN MUKHERJEE</strong> uses and protects any information that you give when you visit our website and/or agree to purchase from us.
      </p>

      <p>
        <strong>SAYANTAN MUKHERJEE</strong> is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, rest assured that it will only be used in accordance with this privacy statement.
      </p>

      <h2 style={styles.subTitle}>Information We Collect</h2>
      <ul style={styles.list}>
        <li>✅ Personal details such as name, email, phone number.</li>
        <li>✅ Demographic information like postcode, preferences, and interests (if required).</li>
        <li>✅ Other details relevant to customer surveys and offers.</li>
      </ul>

      <h2 style={styles.subTitle}>How We Use Your Information</h2>
      <ul style={styles.list}>
        <li>✅ To process orders and payments securely.</li>
        <li>✅ To improve our products and services.</li>
        <li>✅ To send promotional emails about new products, special offers, or other information we think you may find interesting.</li>
        <li>✅ For market research purposes, if needed, to contact you by email, phone, fax, or mail.</li>
        <li>✅ To customize the website according to your interests.</li>
      </ul>

      <h2 style={styles.subTitle}>How We Use Cookies</h2>
      <p>
        A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added, and the cookie helps analyze web traffic or notifies you when you visit a particular site. Cookies allow us to tailor the website to your preferences.
      </p>
      <p>
        You can choose to accept or decline cookies. Most browsers automatically accept cookies, but you can modify your settings to decline them. This may prevent you from fully enjoying the website's features.
      </p>

      <h2 style={styles.subTitle}>Controlling Your Personal Information</h2>
      <p>
        You may choose to restrict the collection or use of your personal information in the following ways:
      </p>
      <ul style={styles.list}>
        <li>✅ Opt-out of direct marketing during form submissions.</li>
        <li>✅ You can request data deletion by contacting us at <a href="mailto:drapeanddime@gmail.com" style={styles.link}>drapeanddime@gmail.com</a>.</li>
      </ul>

      <h2 style={styles.subTitle}>Security of Your Information</h2>
      <p>We are committed to ensuring that your information is secure. To prevent unauthorized access or disclosure, we have implemented suitable measures.</p>

      <h2 style={styles.subTitle}>Third-Party Information</h2>
      <p>
        We will not sell, distribute, or lease your personal information to third parties unless we have your permission or are required by law to do so.
      </p>

      <h2 style={styles.subTitle}>Correcting Your Information</h2>
      <p>
        If you believe any information we hold is incorrect or incomplete, please contact us at:
        <br />
        108 Pallisree Regent Estate, Kolkata, West Bengal, 700092
        <br />
        <strong>Phone:</strong> 8910607304
        <br />
        <a href="mailto:drapeanddime@gmail.com" style={styles.link}>drapeanddime@gmail.com</a>
      </p>
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

export default Privacy;
