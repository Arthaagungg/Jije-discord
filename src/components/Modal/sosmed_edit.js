// Sama persis seperti sosmed_add.js tapi ada tambahan pengecekan
module.exports = new Component({
    customId: 'sosmed_edit',
    type: 'modal',

    /**
     * @param {DiscordBot} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {
        const platform = interaction.fields.getTextInputValue("platform");
        const username = interaction.fields.getTextInputValue("username");

        const sosmed = load();
        if (!sosmed[interaction.user.id] || !sosmed[interaction.user.id][platform]) {
            return await interaction.reply({
                content: `⚠️ Platform ${platform} tidak ditemukan.`,
                ephemeral: true
            });
        }

        sosmed[interaction.user.id][platform] = username;
        save(sosmed);

        await interaction.reply({
            content: `📝 Sosial media **${platform}** telah diperbarui: ${username}`,
            ephemeral: true
        });
    }
}).toJSON();
