module.exports = new Component({
    customId: 'sosmed_delete',
    type: 'modal',

    /**
     * @param {DiscordBot} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {
        const platform = interaction.fields.getTextInputValue("platform");
        const sosmed = load();

        if (!sosmed[interaction.user.id] || !sosmed[interaction.user.id][platform]) {
            return await interaction.reply({
                content: `⚠️ Platform ${platform} tidak ditemukan.`,
                ephemeral: true
            });
        }

        delete sosmed[interaction.user.id][platform];
        save(sosmed);

        await interaction.reply({
            content: `🗑️ Sosial media **${platform}** telah dihapus.`,
            ephemeral: true
        });
    }
}).toJSON();
