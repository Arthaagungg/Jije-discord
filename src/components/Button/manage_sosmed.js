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
        const messageUserId =
            interaction.message.interaction?.user?.id ||
            interaction.message.mentions?.users?.first()?.id ||
            interaction.message.author?.id;

        if (interaction.user.id !== messageUserId) {
            try {
                if (!interaction.deferred && !interaction.replied) {
                    await interaction.reply({
                        content: '❌ Kamu tidak bisa mengelola sosial media milik orang lain.',
                        ephemeral: true
                    });
                }
            } catch (err) {
                console.warn("Gagal membalas (akses bukan pemilik):", err.message);
            }
            return;
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
            // Coba reply, atau followUp jika sudah replied
            if (!interaction.deferred && !interaction.replied) {
                await interaction.reply({
                    content: 'Silakan pilih aksi yang ingin kamu lakukan:',
                    components: [row],
                    ephemeral: true
                });
            } else {
                await interaction.followUp({
                    content: 'Silakan pilih aksi yang ingin kamu lakukan:',
                    components: [row],
                    ephemeral: true
                });
            }
        } catch (error) {
            if (error.code === 10062) {
                console.warn('❗ Interaction tidak valid lagi (ephemeral mungkin sudah di-dismiss)');
            } else if (error.code === 40060) {
                console.warn('❗ Interaction sudah di-acknowledge, tidak bisa reply/followUp lagi');
            } else {
                console.error('❌ Gagal mengirim sosmed_manage:', error);
            }
        }
    }
}).toJSON();
