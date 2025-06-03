const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
    customId: /^sosmed_manage_(\d+)$/,
    
    /**
     * @param {import("discord.js").ButtonInteraction} interaction 
     */
    execute: async (interaction) => {
        const [, targetUserId] = interaction.customId.match(/^sosmed_manage_(\d+)$/);

        if (interaction.user.id !== targetUserId) {
            return interaction.reply({
                content: '❌ Kamu tidak bisa mengelola sosial media milik orang lain.',
                ephemeral: true
            });
        }

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('sosmed_select')
                .setPlaceholder('Pilih aksi yang ingin dilakukan')
                .addOptions([
                    {
                        label: 'Tambah Sosial Media',
                        description: 'Tambahkan link sosial media kamu',
                        value: 'add',
                        emoji: '➕'
                    },
                    {
                        label: 'Edit Sosial Media',
                        description: 'Ubah link sosial media kamu',
                        value: 'edit',
                        emoji: '✏️'
                    },
                    {
                        label: 'Hapus Sosial Media',
                        description: 'Hapus link sosial media kamu',
                        value: 'remove',
                        emoji: '🗑️'
                    }
                ])
        );

        await interaction.reply({
            content: 'Silakan pilih aksi yang ingin kamu lakukan:',
            components: [row],
            ephemeral: true
        });
    }
};
