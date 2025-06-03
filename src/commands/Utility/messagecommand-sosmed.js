const {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { getUserSocials } = require("../../utils/socialManager");

module.exports = new MessageCommand({
  command: {
    name: "sosmed",
    description: "Tampilkan sosial media kamu atau user lain.",
    aliases: [],
  },
  options: {
    cooldown: 3000,
  },

  /**
   * @param {DiscordBot} client
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const target = message.mentions.users.first() || message.author;
    const isSelf = target.id === message.author.id;

    const accounts = getUserSocials(target.id);

    const embed = new EmbedBuilder()
      .setTitle(`Sosial Media ${target.username}`)
      .setColor("Random")
      .setDescription(
        accounts.length > 0
          ? accounts
              .map((acc, i) => {
                const username = acc.url.split("/").pop().replace(/^@/, "");
                return `\`${i + 1}.\` **${acc.platform}**: [${username}](${acc.url})`;
              })
              .join("\n")
          : "Tidak ada sosial media."
      );

    const components = [];

    if (isSelf) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("sosmed-manage")
          .setLabel("Kelola Sosmed")
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId("sosmed-add")
          .setLabel("➕ Input Sosmed")
          .setStyle(ButtonStyle.Secondary)
      );
      components.push(row);
    }

    await message.reply({
      embeds: [embed],
      components,
    });
  },
}).toJSON();
