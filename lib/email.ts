import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = "CashingTech <noreply@cashingtech.com>";
const ADMIN_EMAILS = ["husbantech08@gmail.com"];
const QUOTA_ALERT_EMAILS = ["husbantech08@gmail.com", "info@cashingcarz.com"];

export async function sendEbayQuotaAlert({
  calls,
  limit,
  level,
  reason,
}: {
  calls: number;
  limit: number;
  level: "warning" | "exhausted";
  reason?: string;
}) {
  const resend = getResend();
  if (!resend) return;
  const pct = Math.round((calls / limit) * 100);
  const exhausted = level === "exhausted";
  return resend.emails.send({
    from: FROM,
    to: QUOTA_ALERT_EMAILS,
    subject: exhausted
      ? `🚨 eBay API quota EXHAUSTED — market price refresh paused`
      : `⚠️ eBay API quota at ${pct}% (${calls.toLocaleString()}/${limit.toLocaleString()})`,
    html: `
      <h2>${exhausted ? "eBay daily quota exhausted" : "eBay daily quota warning"}</h2>
      <p><strong>Usage today:</strong> ${calls.toLocaleString()} / ${limit.toLocaleString()} calls (${pct}%)</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
      <p>${
        exhausted
          ? "Market price refreshes are <strong>paused</strong> until the quota resets at midnight US Pacific time. The site keeps showing the last stored prices — no user-facing impact."
          : "Market price refreshes are still running. If the quota is exhausted, refreshes pause automatically until midnight US Pacific."
      }</p>
      <p style="color:#666;font-size:12px">CashingTech · /api/admin/market-refresh</p>
    `,
  });
}

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
  const resend = getResend();
  if (!resend) return;
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
  const resend = getResend();
  if (!resend) return;
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

  const resend = getResend();
  if (!resend) return;
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

  const resend = getResend();
  if (!resend) return;
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
