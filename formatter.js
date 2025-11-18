function safe(v) {
  return (v === undefined || v === null || String(v).trim() === "") ? "N/A" : String(v);
}

function formatFormMessage(data) {
  const email = safe(data["Email"]);
  const discord = safe(data["Discord username or other contact"]);
  const org = safe(data["Game / Company / Team Name"]);
  const tz = safe(data["Country / Timezone"]);
  const name = safe(data["Preferred Name"]);

  return [
    "📌 **New Form Submission**",
    `**Email:** ${email}`,
    `**Discord Username:** ${discord}`,
    `**Game / Company:** ${org}`,
    `**Timezone:** ${tz}`,
    `**Preferred Name:** ${name}`,
  ].join("\n");
}

module.exports = { formatFormMessage };
