const { EmbedBuilder, Message } = require("discord.js");
const MessageCommand = require("../../structure/MessageCommand");
const DiscordBot = require("../../client/DiscordBot");
const supabase = require("../../utils/supabase");
const isMainBot = require('../../utils/isMainBot');

module.exports = new MessageCommand({
  command: {
    name: "listserverfeatures",
    description: "Menampilkan semua fitur per server dari semua bot.",
    aliases: ['lsf']
  },
  options: {
    botDevelopers: true,
  },

  /**
   * @param {DiscordBot} client 
   * @param {Message} message 
   */
  run: async (client, message) => {
    if (!isMainBot(client.user.id)) {
      return message.reply({ content: "❌ Command ini hanya bisa dijalankan oleh **Bot Utama**.", ephemeral: true });
    }

    const { data, error } = await supabase.from("features").select("*");

    if (error || !data.length) {
      return message.reply("⚠️ Tidak ada fitur yang ditemukan di database.");
    }

    // Kelompokkan berdasarkan guild_id dan bot_id
    const grouped = {};
    for (const row of data) {
      const key = `${row.guild_id} | ${row.bot_id}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(`• \`${row.feature}\` — ${row.enabled ? "✅ Aktif" : "❌ Nonaktif"}`);
    }

    const embed = new EmbedBuilder()
      .setTitle("📊 Daftar Fitur Per Server")
      .setColor("Blurple");

    const description = Object.entries(grouped).map(([key, features]) => {
      return `### 🏷️ ${key}\n${features.join("\n")}`;
    }).join("\n\n");

    embed.setDescription(description.length < 4000 ? description : "📄 Terlalu banyak data untuk ditampilkan.");

    return message.reply({ embeds: [embed] });
  }
}).toJSON();
