const {
    ButtonInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ComponentType
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
    customId: 'sosmed_manage',
    type: 'button',

    /**
     * @param {DiscordBot} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        // Cek apakah user yang klik adalah pemilik original
        const messageUserId =
            interaction.message.interaction?.user?.id ||
            interaction.message.mentions?.users?.first()?.id ||
            interaction.message.author?.id;

        if (interaction.user.id !== messageUserId) {
            return interaction.reply({
                content: '❌ Kamu tidak bisa mengelola sosial media milik orang lain.',
                ephemeral: true
            });
        }

        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('sosmed_select')
                .setPlaceholder('Pilih aksi yang ingin dilakukan')
                .addOptions([
                    {
                        label: 'Tambah Sosial Media',
                        description: 'Tambahkan link sosial media kamu',
                        value: 'add',
                        emoji: { name: '➕' }
                    },
                    {
                        label: 'Edit Sosial Media',
                        description: 'Ubah link sosial media kamu',
                        value: 'edit',
                        emoji: { name: '✏️' }
                    },
                    {
                        label: 'Hapus Sosial Media',
                        description: 'Hapus link sosial media kamu',
                        value: 'remove',
                        emoji: { name: '🗑️' }
                    }
                ])
        );

        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'Silakan pilih aksi yang ingin kamu lakukan:',
                    components: [row],
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'Silakan pilih aksi yang ingin kamu lakukan:',
                    components: [row],
                    ephemeral: true
                });
            }
        } catch (err) {
            console.error('❌ Gagal mengirim reply sosmed_manage:', err);
            // Optional: tampilkan pesan error ke user
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '⚠️ Terjadi kesalahan saat memproses interaksi ini.',
                    ephemeral: true
                });
            }
        }
    }
}).toJSON();
