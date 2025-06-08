const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const config = require("../../config");
const supabase = require("../../utils/supabase");

module.exports = new MessageCommand({
    command: {
        name: "removedeveloper",
        description: "Menghapus developer dari database Supabase.",
        aliases: []
    },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor("Red");

        if (message.author.id !== config.users.ownerId) {
            embed.setDescription("❌ Kamu bukan owner bot.");
            return message.reply({ embeds: [embed] });
        }

        const mention = message.mentions.users.first();
        if (!mention) {
            embed.setDescription("❗ Mention user yang ingin dihapus dari developer.");
            return message.reply({ embeds: [embed] });
        }

        const guildId = message.guild?.id;
        if (!guildId) {
            embed.setDescription("❗ Gagal mendeteksi guild ID.");
            return message.reply({ embeds: [embed] });
        }

        const { data, error: deleteError } = await supabase
            .from("developers")
            .delete()
            .eq("user_id", mention.id)
            .eq("guild_id", guildId);

        if (deleteError) {
            console.error(deleteError);
            embed.setDescription("❌ Gagal menghapus developer dari database.");
            return message.reply({ embeds: [embed] });
        }

        if (data.length === 0) {
            embed.setDescription("⚠️ User tersebut tidak terdaftar sebagai developer di server ini.");
            return message.reply({ embeds: [embed] });
        }

        const successEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Developer Dihapus")
            .setDescription(`<@${mention.id}> berhasil dihapus dari daftar developer.`);

        await message.reply({ embeds: [successEmbed] });
    }
});
