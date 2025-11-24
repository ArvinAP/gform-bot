require("dotenv").config();
const express = require("express");
/**
 * Creates and starts the Express server.
 * @param {(data: object) => Promise<void>} sendFormDataToDiscord
 */
function createServer(sendFormDataToDiscord) {
    const app = express();
    app.use(express.json());

    app.post("/webhook/form", async (req, res) => {
        try {
            const body = req.body || {};

            // Normalize email from common variants; default to "Unknown" if absent
            const emailVal = body["Email"] || body["Email address"] || body["email"] || body["email address"] || body["EmailAddress"] || body["emailAddress"] || null;
            if (!emailVal || String(emailVal).trim() === "") {
                body["Email"] = "Unknown";
            } else {
                body["Email"] = String(emailVal);
            }

            await sendFormDataToDiscord(body);
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error("/webhook/form error:", err.message);
            return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
    });

    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => {
        console.log(`Express listening on port ${port}`);
    });

    return app;
}

module.exports = { createServer };
