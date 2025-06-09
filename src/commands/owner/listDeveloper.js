const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const supabase = require("../../utils/supabase");

module.exports = new ApplicationCommand({
    command: {
        name: 'listdevelopers',
        description: 'Menampilkan daftar developer yang terdaftar di database Supabase.',
        type: 1,
        options: []
    },
    options: {
        botOwner: true
    },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const guildId = interaction.guild?.id;
        const embed = new EmbedBuilder().setColor("Blue");

        if (!guildId) {
            embed.setDescription("❗ Gagal mendeteksi guild ID.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const { data, error } = await supabase
            .from("developers")
            .select("user_id")
            .eq("guild_id", guildId);

        if (error) {
            console.error(error);
            embed.setDescription("❌ Gagal mengambil data developer dari database.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!data || data.length === 0) {
            embed.setDescription("📭 Belum ada developer yang terdaftar di server ini.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const devList = data.map((d, i) => `\`${i + 1}.\` <@${d.user_id}>`).join("\n");

        embed
            .setTitle("📋 Daftar Developer")
            .setDescription(devList);

        interaction.reply({ embeds: [embed] });
    }
}).toJSON();
