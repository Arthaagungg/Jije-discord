const { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const path = require("path");
const fs = require("fs");

const sosmedPath = path.join(__dirname, "../../data/sosmed.json");

function loadSosmed() {
    if (!fs.existsSync(sosmedPath)) return {};
    return JSON.parse(fs.readFileSync(sosmedPath, "utf8"));
}

module.exports = new MessageCommand({
    command: {
        name: 'sosmed',
        description: 'Menampilkan sosial media Anda atau pengguna lain.',
        aliases: [],
        permissions: ['SendMessages']
    },
    options: {
        cooldown: 5000,
    },

    /** @param {DiscordBot} client
     *  @param {Message} message
     *  @param {string[]} args
     */
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;
        const sosmed = loadSosmed();
        const data = sosmed[target.id] || {};

        const entries = Object.entries(data).map(([platform, username]) => `> **${platform}**: ${username}`);
        const description = entries.length > 0 ? entries.join("\n") : "_Tidak ada sosial media yang tersimpan._";

        const embed = new EmbedBuilder()
            .setColor(0x00BFFF)
            .setTitle(`📱 Sosial Media - ${target.username}`)
            .setDescription(description)
            .setFooter({ text: `Diminta oleh ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("manage_sosmed")
                .setLabel("Kelola Sosmed")
                .setEmoji("⚙️")
                .setStyle(ButtonStyle.Primary)
        );

        return message.reply({ embeds: [embed], components: [row] });
    }
}).toJSON();
