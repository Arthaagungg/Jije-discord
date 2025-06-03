const { ComponentInteraction, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const Component = require('../../structure/Component');

/**
 * @param {DiscordBot} client
 * @param {ComponentInteraction} interaction
 */
module.exports = new Component({
    customId: 'sosmed_select',

    run: async (client, interaction) => {
        const selectedPlatform = interaction.values?.[0];

        if (!selectedPlatform) {
            return await interaction.reply({ content: 'Platform tidak valid.', ephemeral: true });
        }

        const modal = new ModalBuilder()
            .setCustomId(`sosmed_modal_${selectedPlatform}`)
            .setTitle(`Tambah ${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}`);

        const urlInput = new TextInputBuilder()
            .setCustomId('social_url')
            .setLabel(`Masukkan link ${selectedPlatform}`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder(`https://${selectedPlatform}.com/username`);

        const actionRow = new ActionRowBuilder().addComponents(urlInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    }
}).toJSON();
