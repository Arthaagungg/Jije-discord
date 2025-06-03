
const { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js"); const DiscordBot = require("../../client/DiscordBot"); const ApplicationCommand = require("../../structure/ApplicationCommand"); const path = require("path"); const fs = require("fs");

const dbPath = path.join(__dirname, "../../database/sosmed.json"); function loadData() { if (!fs.existsSync(dbPath)) return {}; return JSON.parse(fs.readFileSync(dbPath)); } function saveData(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); }

module.exports = new ApplicationCommand({ command: { name: "sosmed", description: "Tampilkan sosial media kamu atau user lain", type: 1, options: [ { name: "user", type: 6, // USER description: "User lain", required: false, }, ], }, options: { cooldown: 3000, },

/**

@param {DiscordBot} client

@param {ChatInputCommandInteraction} interaction */ run: async (client, interaction) => { const user = interaction.options.getUser("user") || interaction.user; const data = loadData(); const accounts = data[user.id] || [];


const embed = new EmbedBuilder()
  .setTitle(`Sosial Media ${user.username}`)
  .setColor("Random")
  .setDescription(
    accounts.length > 0
      ? accounts
          .map(
            (acc, i) =>
              `\`${i + 1}.\` **${acc.platform}**: [${acc.username}](${generateUrl(
                acc.platform,
                acc.username
              )})`
          )
          .join("\n")
      : `Tidak ada sosial media.`
  );

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId(`sosmed-manage-${user.id}`)
    .setLabel("Kelola Sosmed")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(user.id !== interaction.user.id) // hanya bisa kelola diri sendiri
);

await interaction.reply({ embeds: [embed], components: [row] });

}, });

function generateUrl(platform, username) { switch (platform.toLowerCase()) { case "instagram": return https://instagram.com/${username}; case "tiktok": return https://tiktok.com/@${username}; case "x": return https://x.com/${username}; default: return username; } }

