const { sendEmail } = require("./index");
const { wrapEmail } = require("./templates");

async function sendPortalApprovalEmail({
  to,
  contactName,
  organisationName,
  loginUrl,
  setPasswordUrl,
}) {
  const html = wrapEmail({
    title: "Account approved",
    intro: `Hello ${contactName || "there"}, your account for ${organisationName || "your organisation"} is now ready.`,
    bodyHtml: `
      <p>Please set your password first, then log in to your portal.</p>
      <p><strong>Organisation:</strong> ${organisationName || "-"}</p>
      <p><strong>Login:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
    `,
    ctaLabel: "Set Your Password",
    ctaUrl: setPasswordUrl,
  });

  return sendEmail({
    to,
    subject: "Your Safety Check Test account is ready",
    html,
    text: `Your account is ready. Set password: ${setPasswordUrl} Login: ${loginUrl}`,
  });
}

module.exports = {
  sendPortalApprovalEmail,
};
