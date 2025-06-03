const { ButtonInteraction } = require("discord.js");
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
        if (interaction.user.id !== interaction.message.interaction?.user?.id &&
            interaction.user.id !== interaction.message.mentions?.users?.first()?.id &&
            interaction.user.id !== interaction.message.author?.id
        ) {
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
                        emoji: { name : '➕' }
                    },
                    {
                        label: 'Edit Sosial Media',
                        description: 'Ubah link sosial media kamu',
                        value: 'edit',
                        emoji: { name: '✏️'}
                    },
                    {
                        label: 'Hapus Sosial Media',
                        description: 'Hapus link sosial media kamu',
                        value: 'remove',
                        emoji: { name: '🗑️' }
                    }
                ])
        );

        await interaction.reply({
            content: 'Silakan pilih aksi yang ingin kamu lakukan:',
            components: [row],
            ephemeral: true
        });
    }
}).toJSON();
