const {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

const INTRO_CHANNEL_ID = "1377465706815164506";

module.exports = new MessageCommand({
  command: {
    name: "setting-intro",
    description: "Set up introduction system",
    aliases: [],
    permissions: ["Administrator"],
  },
  options: {
    cooldown: 3000,
  },
    options: {
        botDevelopers: true
    },

  /**
   * @param {DiscordBot} client
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const channel = message.guild.channels.cache.get(INTRO_CHANNEL_ID);
    if (!channel || channel.type !== ChannelType.GuildText) {
      return message.reply("❌ Channel tidak ditemukan atau bukan text channel.");
    }

    // Nonaktifkan tombol lama
    const messages = await channel.messages.fetch({ limit: 10 });
    for (const msg of messages.values()) {
      if (msg.author.id === client.user.id && msg.components.length > 0) {
        const newRows = msg.components.map((row) => {
          const newRow = ActionRowBuilder.from(row);
          newRow.components = newRow.components.map((btn) =>
            ButtonBuilder.from(btn).setDisabled(true)
          );
          return newRow;
        });

        await msg.edit({ components: newRows }).catch(() => null);
      }
    }

    // Kirim pesan baru dengan tombol
    const embed = new EmbedBuilder()
      .setColor(Math.floor(Math.random() * 16777215))
      .setTitle("📋 Introduce Yourself")
      .setDescription("Klik tombol di bawah untuk memperkenalkan dirimu ke komunitas!")
      .setFooter({
        text: `Temen - Temen Jije Introductions`,
        iconURL: message.guild.iconURL({ dynamic: true }),
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("intro_button")
        .setLabel("Introduce Yourself")
        .setEmoji("🧾")
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });

    await message.reply("✅ Sistem introduction berhasil diatur.");
  },
}).toJSON();