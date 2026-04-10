const { sendEmail } = require("./index");
const { wrapEmail } = require("./templates");

async function sendJobAssignedEmail({
  to,
  employeeName,
  jobTitle,
  address,
  portalUrl,
}) {
  const html = wrapEmail({
    title: "New job assigned",
    intro: `Hello ${employeeName || "team member"}, a new job has been assigned to you.`,
    bodyHtml: `
      <p><strong>Job:</strong> ${jobTitle || "-"}</p>
      <p><strong>Address:</strong> ${address || "-"}</p>
    `,
    ctaLabel: "Open Portal",
    ctaUrl: portalUrl,
  });

  return sendEmail({
    to,
    subject: `New job assigned: ${jobTitle || "Safety Check Test job"}`,
    html,
    text: `A new job has been assigned to you: ${jobTitle || "-"}. Portal: ${portalUrl}`,
  });
}

async function sendJobCompletedEmail({
  to,
  contactName,
  jobTitle,
  portalUrl,
}) {
  const html = wrapEmail({
    title: "Job completed",
    intro: `Hello ${contactName || "there"}, your requested work has now been completed.`,
    bodyHtml: `
      <p><strong>Job:</strong> ${jobTitle || "-"}</p>
      <p>You can log in to the portal to review updates, reports, or next steps.</p>
    `,
    ctaLabel: "Open Portal",
    ctaUrl: portalUrl,
  });

  return sendEmail({
    to,
    subject: `Job completed: ${jobTitle || "Safety Check Test job"}`,
    html,
    text: `Your job has been completed: ${jobTitle || "-"}. Portal: ${portalUrl}`,
  });
}

module.exports = {
  sendJobAssignedEmail,
  sendJobCompletedEmail,
};
