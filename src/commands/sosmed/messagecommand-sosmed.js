const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js"); const DiscordBot = require("../../client/DiscordBot"); const MessageCommand = require("../../structure/MessageCommand"); const path = require("path"); const fs = require("fs");

const dbPath = path.join(__dirname, "../../database/sosmed.json"); function loadData() { if (!fs.existsSync(dbPath)) return {}; return JSON.parse(fs.readFileSync(dbPath)); } function saveData(data) { fs.writeFileSync(dbPath, JSON.stringify(data, null, 2)); }

module.exports = new MessageCommand({ command: { name: "sosmed", description: "Tampilkan sosial media kamu atau user lain.", aliases: [] }, options: { cooldown: 3000 }, /**

@param {DiscordBot} client

@param {Message} message

@param {string[]} args */ run: async (client, message, args) => { const target = message.mentions.users.first() || message.author; const data = loadData(); const accounts = data[target.id] || [];


const embed = new EmbedBuilder()
  .setTitle(`Sosial Media ${target.username}`)
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
    .setCustomId(`sosmed-manage-${message.author.id}`)
    .setLabel("Kelola Sosmed")
    .setStyle(ButtonStyle.Primary)
    .setDisabled(target.id !== message.author.id)
);

await message.reply({ embeds: [embed], components: [row] });

} }).toJSON();

function generateUrl(platform, username) { switch (platform.toLowerCase()) { case "instagram": return https://instagram.com/${username}; case "tiktok": return https://tiktok.com/@${username}; case "x": return https://x.com/${username}; default: return username; } }

