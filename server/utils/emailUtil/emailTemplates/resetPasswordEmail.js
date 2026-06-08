export const resetPasswordEmail = (username, resetLink) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:40px 20px;background:#0a0e17;font-family:'JetBrains Mono',monospace;">
  <div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1e2d40;border-radius:12px;overflow:hidden;">
    <div style="height:3px;background:linear-gradient(90deg,#00ccff,#7c3aed);"></div>
    <div style="padding:40px;">
      <p style="margin:0;font-size:16px;font-weight:700;color:#e2e8f0;">Pulse<span style="color:#00ff99;">ML</span></p>
      <h1 style="margin:24px 0 12px;font-size:22px;font-weight:700;color:#e2e8f0;">Reset your password, ${username}</h1>
      <p style="margin:0 0 32px;font-size:13px;color:#64748b;line-height:1.8;">You requested a password reset. Click the button below — the link expires in 15 minutes.</p>
      <a href="${resetLink}" style="display:inline-block;padding:12px 28px;background:linear-gradient(90deg,#00ccff,#7c3aed);color:#0a0e17;font-weight:700;font-size:13px;text-decoration:none;border-radius:8px;">Reset password</a>
      <div style="background:#0a0e17;border:1px solid #1e2d40;border-radius:8px;padding:14px 20px;margin-top:32px;">
        <p style="margin:0 0 4px;font-size:10px;color:#475569;text-transform:uppercase;letter-spacing:0.1em;">Link expires</p>
        <p style="margin:0;font-size:13px;color:#00ccff;font-weight:700;">&#9679; 15 minutes</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#334155;margin-top:24px;">If you didn't request this, ignore this email.</p>
</body></html>`
