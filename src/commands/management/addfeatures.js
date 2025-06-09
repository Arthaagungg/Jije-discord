const { Message } = require("discord.js");
const MessageCommand = require("../../structure/MessageCommand");
const DiscordBot = require("../../client/DiscordBot");
const supabase = require("../../utils/supabase");
const isMainBot = require("../../utils/isMainBot");

module.exports = new MessageCommand({
  command: {
    name: "addfeatures",
    description: "Menambahkan fitur baru untuk bot di server ini.",
    aliases: ['addf'],
    usage: "!addfeatures <bot_id> <nama_fitur> [true/false]",
    permissions: ["Administrator"]
  },
  options: {
    botDevelopers: true,
  },

  /**
   * @param {DiscordBot} client
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (!isMainBot(client.user.id)) {
      return message.reply({
        content: "❌ Command ini hanya bisa dijalankan oleh **Bot Utama**.",
        ephemeral: true
      });
    }

    const [botId, feature, enabledStr] = args;
    const enabled = enabledStr === "false" ? false : true;

    if (!botId || !feature) {
      return message.reply("⚠️ Format salah. Gunakan: `!addfeatures <bot_id> <nama_fitur> [true/false]`");
    }

    const guildId = message.guild.id;

    // Cek apakah sudah ada
    const { data: existing, error: checkError } = await supabase
      .from("features")
      .select("*")
      .eq("guild_id", guildId)
      .eq("bot_id", botId)
      .eq("feature", feature)
      .maybeSingle();

    if (checkError) {
      return message.reply("❌ Terjadi kesalahan saat memeriksa fitur.");
    }

    if (existing) {
      return message.reply("⚠️ Fitur tersebut sudah terdaftar untuk bot ini di server ini.");
    }

    // Masukkan fitur
    const { error: insertError } = await supabase
      .from("features")
      .insert({
        guild_id: guildId,
        bot_id: botId,
        feature,
        enabled
      });

    if (insertError) {
      return message.reply("❌ Gagal menambahkan fitur ke database.");
    }

    return message.reply(`✅ Fitur \`${feature}\` berhasil ditambahkan untuk bot \`${botId}\` di server ini.`);
  }
}).toJSON();
