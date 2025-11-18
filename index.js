require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { formatFormMessage } = require("./formatter");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.login(process.env.TOKEN);

client.once("ready", () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

async function sendFormDataToDiscord(data) {
    try {
        const channelId = process.env.TARGET_CHANNEL;
        if (!channelId) throw new Error("TARGET_CHANNEL is not set");

        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) throw new Error("Target channel not found or not text-based");

        const message = formatFormMessage(data);
        await channel.send({ content: message });
        console.log("Form submission forwarded to Discord");
    } catch (err) {
        console.error("Failed to send form data to Discord:", err.message);
        throw err;
    }
}

module.exports = { sendFormDataToDiscord };

// Start Express server and inject the sender
try {
    const { createServer } = require("./server");
    createServer(sendFormDataToDiscord);
} catch (e) {
    console.error("Failed to start server:", e.message);
}
