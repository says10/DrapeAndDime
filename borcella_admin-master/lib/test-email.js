import { sendEmail } from "@/lib/email";



sendEmail({
  to: "sayantanmukherjee@gmail.com",
  subject: "Test Email",
  text: "If you received this, email integration is working!",
  html: "<h2>If you received this, email integration is working!</h2>",
}).then(() => console.log("✅ Email Sent"))
  .catch((err) => console.error("❌ Email Error:", err));
