import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const TO = process.env.NOTIFY_EMAIL || "Saugat4study@gmail.com";

export async function sendCommentNotification({ name, email, postTitle, content }) {
  return resend.emails.send({
    from: "The Himalayan Guy <notifications@resend.dev>", // swap for your verified domain once set up
    to: TO,
    subject: `New comment on "${postTitle}"`,
    html: `
      <h2>New blog comment</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Post:</b> ${escapeHtml(postTitle)}</p>
      <p><b>Comment:</b></p>
      <p>${escapeHtml(content)}</p>
      <p><b>Date:</b> ${new Date().toLocaleString()}</p>
    `,
  });
}

export async function sendContactNotification({ name, email, subject, message }) {
  return resend.emails.send({
    from: "The Himalayan Guy <notifications@resend.dev>",
    to: TO,
    subject: `New contact form message: ${subject || "No subject"}`,
    html: `
      <h2>New contact form submission</h2>
      <p><b>Name:</b> ${escapeHtml(name)}</p>
      <p><b>Email:</b> ${escapeHtml(email)}</p>
      <p><b>Subject:</b> ${escapeHtml(subject || "")}</p>
      <p><b>Message:</b></p>
      <p>${escapeHtml(message)}</p>
      <p><b>Date:</b> ${new Date().toLocaleString()}</p>
    `,
  });
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
