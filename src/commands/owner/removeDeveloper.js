const { EmbedBuilder, Message } = require("discord.js");
const DiscordBot = require("../../../client/DiscordBot");
const MessageCommand = require("../../../structure/MessageCommand");
const supabase = require("../../../modules/supabase");

module.exports = new MessageCommand({
  command: {
    name: "removedeveloper",
    description: "Menghapus developer dari database.",
    aliases: [],
  },
  options: {
    botOwner: false,
  },

  /**
   * @param {DiscordBot} client 
   * @param {Message} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {
    const target = message.mentions.users.first() || client.users.cache.get(args[0]);

    if (!target) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ Pengguna tidak ditemukan")
            .setDescription("Kamu harus mention user atau masukkan ID mereka.")
        ]
      });
    }

    // Cek apakah user adalah developer di server ini
    const { data: existing, error: selectError } = await supabase
      .from("developers")
      .select("*")
      .eq("user_id", target.id)
      .eq("guild_id", message.guild.id)
      .single();

    if (!existing) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("⚠️ User tidak ditemukan di database")
            .setDescription("User tersebut tidak terdaftar sebagai developer di server ini.")
        ]
      });
    }

    // Hapus data
    const { error: deleteError } = await supabase
      .from("developers")
      .delete()
      .eq("user_id", target.id)
      .eq("guild_id", message.guild.id);

    if (deleteError) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ Gagal menghapus developer")
            .setDescription("Terjadi kesalahan saat menghapus data dari database.")
        ]
      });
    }

    // Berhasil
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Green")
          .setTitle("✅ Developer berhasil dihapus")
          .setDescription(`User <@${target.id}> berhasil dihapus dari daftar developer.`)
      ]
    });
  }
}).toJSON();
