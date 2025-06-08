const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const supabase = require("../../utils/supabase");

module.exports = new MessageCommand({
    command: {
        name: "listdevelopers",
        description: "Menampilkan daftar developer yang terdaftar di database Supabase.",
        aliases: []
    },
  options: {
    botOwner: true,
  },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const guildId = message.guild?.id;
        const embed = new EmbedBuilder().setColor("Blue");

        if (!guildId) {
            embed.setDescription("❗ Gagal mendeteksi guild ID.");
            return message.reply({ embeds: [embed] });
        }

        const { data, error } = await supabase
            .from("developers")
            .select("user_id")
            .eq("guild_id", guildId);

        if (error) {
            console.error(error);
            embed.setDescription("❌ Gagal mengambil data developer dari database.");
            return message.reply({ embeds: [embed] });
        }

        if (!data || data.length === 0) {
            embed.setDescription("📭 Belum ada developer yang terdaftar di server ini.");
            return message.reply({ embeds: [embed] });
        }

        const devList = data.map((d, i) => `\`${i + 1}.\` <@${d.user_id}>`).join("\n");

        embed
            .setTitle("📋 Daftar Developer")
            .setDescription(devList);

        message.reply({ embeds: [embed] });
    }
});
