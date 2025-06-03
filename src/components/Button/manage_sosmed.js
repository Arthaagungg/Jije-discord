const {
    ButtonInteraction,
    ActionRowBuilder,
    StringSelectMenuBuilder
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
        // Cegah orang lain klik tombol yang bukan miliknya
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

        // Safe reply with fallback to followUp
        try {
            await interaction.reply({
                content: 'Silakan pilih aksi yang ingin kamu lakukan:',
                components: [row],
                ephemeral: true
            });
        } catch (err) {
            if (err.code === 10062) {
                // Unknown interaction (sudah dismissed), gunakan followUp
                return interaction.followUp({
                    content: 'Silakan pilih aksi yang ingin kamu lakukan:',
                    components: [row],
                    ephemeral: true
                });
            } else {
                console.error("❌ Gagal merespon tombol sosmed_manage:", err);
                return interaction.followUp({
                    content: '❌ Terjadi kesalahan saat menampilkan menu sosial media.',
                    ephemeral: true
                });
            }
        }
    }
}).toJSON();
