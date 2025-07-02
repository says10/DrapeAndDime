import React from "react";

const ContactUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/50 to-gray-100/50 flex items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-4 sm:p-8 mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
            Get in Touch with <span className="text-orange-500">Drape & Dime</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            We're here to help! Reach out for support, inquiries, or collaborations.
          </p>
        </section>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Contact Details</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-2">
            Have questions? We'd love to hear from you! Feel free to reach us through any of the options below.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            <a href="mailto:drapeanddime@gmail.com" className="flex items-center gap-2 text-base text-gray-700 hover:text-orange-500 transition">
              <img src="/gmail.svg" alt="Gmail" className="w-6 h-6" />
              drapeanddime@gmail.com
            </a>
          </div>
          </div>

          {/* Business Information */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Business Information</h2>
        </div>

          {/* Customer Support */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Customer Support</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Our support team is available Monday to Saturday, 10:00 AM - 6:00 PM IST.
          </p>
        </div>

          {/* FAQs Section */}
        <div>
          <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">FAQs</h2>
          <p className="text-sm sm:text-base text-gray-600">
            Check our <a href="/faqs" className="text-blue-600 hover:underline font-semibold">FAQs page</a> for common queries about orders, shipping, and returns.
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
