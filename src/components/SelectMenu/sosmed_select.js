const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');
const socialManager = require('../../utils/socialManager');

module.exports = {
    customId: 'sosmed_select',

    /**
     * @param {import('discord.js').SelectMenuInteraction} interaction
     */
    execute: async (interaction) => {
        const action = interaction.values[0]; // 'add', 'edit', 'remove'
        const userId = interaction.user.id;

        if (action === 'add') {
            const modal = new Modal()
                .setCustomId('sosmed_modal_add')
                .setTitle('➕ Tambah Sosial Media')
                .addComponents([
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('platform')
                            .setLabel('Platform (tiktok / instagram / x)')
                            .setPlaceholder('Misal: instagram')
                            .setRequired(true)
                            .setStyle('SHORT')
                    ),
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('url')
                            .setLabel('Link Sosial Media')
                            .setPlaceholder('https://...')
                            .setRequired(true)
                            .setStyle('SHORT')
                    )
                ]);
            return interaction.showModal(modal);
        }

        const userSocials = socialManager.getUserSocials(userId);
        if (userSocials.length === 0) {
            return interaction.reply({
                content: '❌ Kamu belum punya sosial media untuk dikelola.',
                ephemeral: true
            });
        }

        const choices = userSocials.map((entry, i) => ({
            label: `${entry.platform} - ${entry.url}`,
            value: `${entry.platform}::${entry.url}`.slice(0, 100) // limit Discord
        }));

        if (action === 'edit') {
            const modal = new Modal()
                .setCustomId('sosmed_modal_edit')
                .setTitle('✏️ Edit Sosial Media')
                .addComponents([
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('target')
                            .setLabel('Pilih (platform::url)')
                            .setPlaceholder('contoh: instagram::https://...')
                            .setRequired(true)
                            .setStyle('SHORT')
                    ),
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('newurl')
                            .setLabel('Ganti dengan link baru')
                            .setPlaceholder('https://...')
                            .setRequired(true)
                            .setStyle('SHORT')
                    )
                ]);
            return interaction.showModal(modal);
        }

        if (action === 'remove') {
            const modal = new Modal()
                .setCustomId('sosmed_modal_remove')
                .setTitle('🗑️ Hapus Sosial Media')
                .addComponents([
                    new MessageActionRow().addComponents(
                        new TextInputComponent()
                            .setCustomId('target')
                            .setLabel('Pilih (platform::url)')
                            .setPlaceholder('contoh: instagram::https://...')
                            .setRequired(true)
                            .setStyle('SHORT')
                    )
                ]);
            return interaction.showModal(modal);
        }
    }
};
