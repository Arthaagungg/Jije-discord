const { EmbedBuilder, Message } = require("discord.js");
const MessageCommand = require("../../structure/MessageCommand");
const DiscordBot = require("../../client/DiscordBot");
const supabase = require("../../utils/supabase");

module.exports = new MessageCommand({
  command: {
    name: "listserverfeatures",
    description: "Melihat daftar fitur bot per server.",
    aliases: [lsf]
  },
  options: {
    botDevelopers: true,
  },

  /**
   * @param {DiscordBot} client 
   * @param {Message} message 
   */
  run: async (client, message) => {
    if (!client.isMainBot()) {
      return message.reply({ content: "❌ Command ini hanya bisa dijalankan oleh **Bot Utama**.", ephemeral: true });
    }

    const { data, error } = await supabase
      .from("features")
      .select("*")
      .eq("guild_id", message.guild.id);

    if (error || !data.length) {
      return message.reply("⚠️ Tidak ada fitur yang terdaftar di server ini.");
    }

    const embed = new EmbedBuilder()
      .setTitle(`📋 Daftar Fitur di ${message.guild.name}`)
      .setColor("Blue")
      .setDescription(data.map(row => 
        `**Bot ID:** \`${row.bot_id}\`\n**Fitur:** \`${row.feature}\`\n**Aktif:** ${row.enabled ? "✅" : "❌"}\n`
      ).join("\n---\n"));

    return message.reply({ embeds: [embed] });
  }
}).toJSON();
