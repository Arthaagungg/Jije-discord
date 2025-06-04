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
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    try {
      const user = message.mentions.users.first() || message.author;
      const isSelf = user.id === message.author.id;

      let socials = [];
      try {
        socials = await getUserSocials(user.id);
      } catch (err) {
        console.error("Gagal mengambil sosial media:", err);
      }

      const iconMap = {
        instagram: "📸",
        tiktok: "🎵",
        x: "🐦",
      };

      const formatted =
        socials.length > 0
          ? socials
              .map((s) => {
                const platform = String(s.platform || "").toLowerCase();
                const icon = iconMap[platform] || "🔗";

                let username = "tidak diketahui";
                if (typeof s.url === "string") {
                  const parts = s.url.split("/");
                  username = parts[parts.length - 1] || "tidak diketahui";
                }

                return `${icon} [${s.platform?.toUpperCase() || "?"}](<${s.url || "#" }>) → \`@${username}\``;
              })
              .join("\n")
          : "*Belum ada sosial media yang ditambahkan.*";

      const embed = new EmbedBuilder()
        .setColor("#1DA1F2")
        .setAuthor({
          name: user.username,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle("🌐 Daftar Sosial Media")
        .setDescription(formatted)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setFooter({
          text: isSelf
            ? "Gunakan tombol di bawah untuk mengelola sosial media Anda."
            : " ",
          iconURL: isSelf ? client.user.displayAvatarURL() : undefined,
        });

      const components = [];

      if (isSelf) {
        components.push(
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`sosmed_manage_${user.id}`)
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
    } catch (err) {
      console.error("Error saat menjalankan command sosmed:", err);
      return message.reply("❌ Terjadi kesalahan saat memproses sosial media.");
    }
  },
}).toJSON();
