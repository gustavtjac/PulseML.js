export const registerEmail = (username) => `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:40px 20px;background:#0a0e17;font-family:'JetBrains Mono',monospace;">
  <div style="max-width:560px;margin:0 auto;background:#111827;border:1px solid #1e2d40;border-radius:12px;overflow:hidden;">
    <div style="height:3px;background:linear-gradient(90deg,#00ff99,#00ccff);"></div>
    <div style="padding:40px;">
      <p style="margin:0;font-size:16px;font-weight:700;color:#e2e8f0;">Pulse<span style="color:#00ff99;">ML</span></p>
      <h1 style="margin:24px 0 12px;font-size:22px;font-weight:700;color:#e2e8f0;">Welcome, ${username}</h1>
      <p style="margin:0 0 32px;font-size:13px;color:#64748b;line-height:1.8;">Your account has been created. You can now log in to PulseML.</p>
      <div style="background:#0a0e17;border:1px solid #1e2d40;border-radius:8px;padding:14px 20px;">
        <p style="margin:0 0 4px;font-size:10px;color:#475569;text-transform:uppercase;letter-spacing:0.1em;">Account status</p>
        <p style="margin:0;font-size:13px;color:#00ff99;font-weight:700;">&#9679; Active</p>
      </div>
    </div>
  </div>
  <p style="text-align:center;font-size:11px;color:#334155;margin-top:24px;">If this wasn't you, ignore this email.</p>
</body></html>`;
