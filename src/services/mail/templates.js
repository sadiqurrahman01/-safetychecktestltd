function wrapEmail({ title, intro, bodyHtml = "", ctaLabel = "", ctaUrl = "" }) {
  const cta = ctaLabel && ctaUrl
    ? `
      <p style="margin:24px 0;">
        <a href="${ctaUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px;">
          ${ctaLabel}
        </a>
      </p>
    `
    : "";

  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#0f172a;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;">
        <div style="background:#0f172a;padding:24px 28px;color:#ffffff;text-align:center;">
          <div style="font-size:24px;font-weight:800;">Safety Check Test Ltd</div>
          <div style="margin-top:6px;color:#cbd5e1;">${title}</div>
        </div>
        <div style="padding:28px;">
          <p style="margin-top:0;">${intro}</p>
          ${bodyHtml}
          ${cta}
          <p style="font-size:13px;color:#64748b;margin-top:28px;">
            Safety Check Test Ltd<br>
            Reply to support@safetychecktestltd.co.uk if you need help.
          </p>
        </div>
      </div>
    </div>
  `;
}

module.exports = { wrapEmail };
