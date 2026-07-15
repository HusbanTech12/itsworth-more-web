import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const FROM = "CashingTech <husbantech08@gmail.com>";
const ADMIN_EMAILS = ["husbantech08@gmail.com", "Info@cashingcarz.com"];

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    replyTo: email,
    subject: `[Contact Form] ${subject}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <blockquote>${message.replace(/\n/g, "<br>")}</blockquote>
    `,
  });
}

export async function sendNewsletterConfirmation(email: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to CashingTech Newsletter!",
    html: `
      <h2>You're subscribed!</h2>
      <p>Thanks for signing up for the CashingTech newsletter.</p>
      <p>We'll send you tips, guides, and special offers on selling your used electronics.</p>
      <p>Stay tuned!</p>
    `,
  });
}

export async function sendBulkQuoteNotification({
  name,
  companyName,
  email,
  phone,
  comments,
  type,
  items,
}: {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  comments?: string;
  type: string;
  items?: { productName: string; quantity: number }[];
}) {
  const itemRows = items
    ?.map((i) => `<tr><td>${i.productName}</td><td>${i.quantity}</td></tr>`)
    .join("");

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    replyTo: email,
    subject: `[${type.toUpperCase()} Quote] ${companyName || name}`,
    html: `
      <h2>New ${type.toUpperCase()} Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Company:</strong> ${companyName || "N/A"}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      ${comments ? `<p><strong>Comments:</strong><br>${comments.replace(/\n/g, "<br>")}</p>` : ""}
      ${itemRows ? `
        <h3>Items</h3>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
          <tr><th>Product</th><th>Qty</th></tr>
          ${itemRows}
        </table>
      ` : ""}
    `,
  });
}

export async function sendOrderConfirmation({
  email,
  offerNumber,
  totalCents,
  items,
}: {
  email: string;
  offerNumber: string;
  totalCents: number;
  items: { deviceName: string; conditionLabel?: string; offeredPriceCents: number }[];
}) {
  const itemRows = items
    .map(
      (i) =>
        `<tr><td>${i.deviceName}</td><td>${i.conditionLabel || "—"}</td><td>$${(i.offeredPriceCents / 100).toFixed(2)}</td></tr>`,
    )
    .join("");

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Order Confirmed — ${offerNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your offer number is <strong>${offerNumber}</strong>.</p>
      <p>Here's what you're sending us:</p>
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
        <tr><th>Device</th><th>Condition</th><th>Offer</th></tr>
        ${itemRows}
      </table>
      <p><strong>Total:</strong> $${(totalCents / 100).toFixed(2)}</p>
      <p>We'll send you a shipping label shortly. Once we receive your device, we'll inspect it and process your payment within 24-48 hours.</p>
      <p>If you have any questions, reply to this email or contact us at support@cashingtech.com.</p>
    `,
  });
}
