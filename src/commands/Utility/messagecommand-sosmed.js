const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { getUserSocials } = require("../../utils/socials");

const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
  command: {
    name: "sosmed",
    description: "Lihat sosial media seseorang",
    aliases: ["sosmed"],
    permissions: ["SendMessages"],
  },
  options: {
    cooldown: 5000,
  },

  /**
   * @param {DiscordBot} client
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;
    const isSelf = user.id === message.author.id;

    const socials = await getUserSocials(user.id);

    const iconMap = {
      instagram: "📸",
      tiktok: "🎵",
      x: "🐦",
    };

    const formatted =
      socials.length > 0
        ? socials
            .map((s) => {
              const icon = iconMap[s.platform.toLowerCase()] || "🔗";
              const username = s.url.split("/").pop(); // ambil `akunlu`
              return `${icon} [${s.platform.toUpperCase()}](<${s.url}>) → \`@${username}\``;
            })
            .join("\n")
        : "*Belum ada sosial media yang ditambahkan.*";

    const embed = new EmbedBuilder()
      .setColor("#1DA1F2")
      .setAuthor({
        name: `${user.username}`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setTitle("🌐 Daftar Sosial Media")
      .setDescription(formatted)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: isSelf
          ? "Gunakan tombol di bawah untuk mengelola sosial media Anda."
          : " ",
        iconURL: isSelf ? client.user.displayAvatarURL() : null,
      });

    const components = [];

    if (isSelf) {
      components.push(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`sosmed_manage_${user.id}`) // 🔧 dinamis sesuai user id
            .setLabel("Kelola Sosial Media")
            .setEmoji("🛠️")
            .setStyle(ButtonStyle.Primary)
        )
      );
    }

    return message.reply({
      embeds: [embed],
      components,
    });
  },
}).toJSON();
