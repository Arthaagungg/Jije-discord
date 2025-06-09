const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const supabase = require("../../utils/supabase");
const config = require("../../config");

module.exports = new MessageCommand({
  command: {
    name: 'ping',
    description: 'Menampilkan kecepatan koneksi.',
    aliases: ['p'],
    permissions: ['SendMessages']
  },
  options: {
    cooldown: 5000,
    feature: 'ping'
  },

  /**
   * @param {DiscordBot} client 
   * @param {Message} message 
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const featureName = 'ping';
    const guildId = message.guild.id;
    const botId = client.user.id;
    const userId = message.author.id;

    // 1. Cek apakah fitur aktif
    const { data: featureData, error: featureError } = await supabase
      .from("features")
      .select("enabled")
      .eq("guild_id", guildId)
      .eq("bot_id", botId)
      .eq("feature", featureName)
      .single();

    if (featureError || !featureData || !featureData.enabled) {
      // 2. Cek apakah user adalah developer
      const { data: devData } = await supabase
        .from("developers")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      const isDeveloper = !!devData;
      const ownerId = config.users.ownerId;

      if (isDeveloper) {
        return message.reply({
          content: `❌ Fitur \`${featureName}\` sedang dinonaktifkan di server ini.\nSilakan hubungi <@${ownerId}> untuk mengaktifkan fitur tersebut.`,
          ephemeral: true
        });
      }

      // Selain developer: tidak ada balasan sama sekali
      return;
    }

    // ✅ Lanjutkan kalau fitur aktif
    const ping = client.ws.ping;
    let status = '🟢 Sangat Cepat';
    let color = 0x43B581;

    if (ping > 200) {
      status = '🟡 Cukup Stabil';
      color = 0xFAA61A;
    }

    if (ping > 400) {
      status = '🔴 Sangat Lambat';
      color = 0xF04747;
    }

    await message.reply({
      content: '📶 Berikut detail latensi bot:',
      embeds: [{
        color,
        title: '🏓 Pong!',
        description: `**Latensi:** \`${ping}ms\`\n**Status:** ${status}`,
        footer: {
          text: `Diminta oleh ${message.author.username}`,
          icon_url: message.author.displayAvatarURL({ dynamic: true })
        },
        timestamp: new Date()
      }]
    });
  }
}).toJSON();
