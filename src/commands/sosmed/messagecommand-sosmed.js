const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../data/sosmed.json");

function loadData() {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
    name: "sosmed",
    description: "Tampilkan sosial media kamu atau orang lain",
    type: "messageCommand",

    /**
     * @param {import("discord.js").Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const target = message.mentions.users.first() || message.author;
        const data = loadData();
        const userData = data[target.id];

        const embed = new EmbedBuilder()
            .setTitle(`📱 Sosial Media ${target.username}`)
            .setColor("Blurple")
            .setThumbnail(target.displayAvatarURL())
            .setFooter({ text: `Diminta oleh ${message.author.username}`, iconURL: message.author.displayAvatarURL() });

        if (!userData || Object.keys(userData).length === 0) {
            embed.setDescription("❌ Tidak ada sosial media yang ditemukan.");
        } else {
            const fields = Object.entries(userData).map(([platform, username]) => ({
                name: platform,
                value: username,
                inline: true
            }));
            embed.addFields(fields);
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("manage_sosmed")
                .setLabel("Kelola Sosmed")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("⚙️")
        );

        await message.reply({
            embeds: [embed],
            components: target.id === message.author.id ? [row] : []
        });
    }
};
