const { ModalSubmitInteraction } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const Modal = require('../../structure/Modal');
const socialManager = require('../../utils/socialManager');

/**
 * @param {DiscordBot} client 
 * @param {ModalSubmitInteraction} interaction 
 */
module.exports = new Modal({
    customId: /^sosmed_modal_(instagram|tiktok|x)$/,

    run: async (client, interaction) => {
        const match = interaction.customId.match(/^sosmed_modal_(instagram|tiktok|x)$/);
        const platform = match?.[1];

        if (!platform) {
            return await interaction.reply({ content: 'Platform tidak valid.', ephemeral: true });
        }

        const url = interaction.fields.getTextInputValue('social_url');

        if (!url.startsWith('http')) {
            return await interaction.reply({ content: 'Link harus dimulai dengan http atau https.', ephemeral: true });
        }

        // Tambahkan atau update sosial media
        socialManager.addSocial(interaction.user.id, platform, url);

        await interaction.reply({
            content: `✅ ${platform.charAt(0).toUpperCase() + platform.slice(1)} berhasil ditambahkan.`,
            ephemeral: true
        });
    }
}).toJSON();
