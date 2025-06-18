import "dotenv/config";
import { connectToDB } from "../lib/mongoDB";
import CartSession from "../lib/models/CartSession";
import { cartAbandonmentTemplates } from "../lib/email-templates/cartAbandonment";
import nodemailer from "nodemailer";

type AbandonmentType = 'abandonment_1h' | 'abandonment_24h' | 'abandonment_72h';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  await connectToDB();

  const now = new Date();
  const abandonmentWindows: { hours: number; type: AbandonmentType }[] = [
    { hours: 1, type: "abandonment_1h" },
    { hours: 24, type: "abandonment_24h" },
    { hours: 72, type: "abandonment_72h" },
  ];

  for (const window of abandonmentWindows) {
    const threshold = new Date(now.getTime() - window.hours * 60 * 60 * 1000);
    const sessions = await CartSession.find({
      status: "active",
      lastActivity: { $lte: threshold },
      $or: [
        { "emailsSent.type": { $ne: window.type } },
        { emailsSent: { $size: 0 } },
      ],
    });

    for (const session of sessions) {
      // Prepare email
      const template = cartAbandonmentTemplates[window.type];
      const { userEmail, userName, cartItems, totalValue } = session;
      const { subject, html } = template(userName || "there", cartItems, totalValue);

      // Send email
      try {
        await transporter.sendMail({
          from: `Drape & Dime <${process.env.SMTP_FROM}>`,
          to: userEmail,
          subject,
          html,
        });
        // Log email in session
        session.emailsSent.push({ type: window.type, sentAt: new Date() });
        // Mark as abandoned if this is the first abandonment email
        if (window.type === "abandonment_1h") {
          session.status = "abandoned";
          session.abandonedAt = new Date();
        }
        await session.save();
        console.log(`Sent ${window.type} email to ${userEmail}`);
      } catch (err) {
        console.error(`Failed to send ${window.type} email to ${userEmail}:`, err);
      }
    }
  }

  console.log("Cart abandonment email job complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Cart abandonment job failed:", err);
  process.exit(1);
}); 