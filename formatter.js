function safe(v) {
  return (v === undefined || v === null || String(v).trim() === "") ? "N/A" : String(v);
}

function formatFormMessage(data) {
  const email = safe(data["Email"]);
  const discord = safe(data["Discord username or other contact"]);
  const org = safe(data["What is the name of your game and company/team name "]);
  const tz = safe(data["What country or timezone are you in?"]);
  const name = safe(data["What is the name you want to be called?"]);

  const lines = [
    "📌 **New Form Submission**",
    `**Email:** ${email}`,
    `**Discord Username:** ${discord}`,
    `**Game / Company:** ${org}`,
    `**Timezone:** ${tz}`,
    `**Preferred Name:** ${name}`,
  ];

  const known = new Set([
    "Email",
    "Discord username or other contact",
    "What is the name of your game and company/team name ",
    "What country or timezone are you in?",
    "What is the name you want to be called?",
  ]);

  // Append any extra fields that are not part of the known set
  Object.keys(data).forEach((key) => {
    if (!known.has(key)) {
      lines.push(`**${key}:** ${safe(data[key])}`);
    }
  });

  return lines.join("\n\n");
}

module.exports = { formatFormMessage };
