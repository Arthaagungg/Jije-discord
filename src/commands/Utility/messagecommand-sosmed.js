const { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const { getUserSocials } = require("../../utils/sosmedStorage");

module.exports = new ApplicationCommand({
    command: {
        name: 'sosmed',
        description: 'Lihat sosial media kamu atau orang lain',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'User yang ingin kamu lihat sosial medianya',
                type: 6, // USER
                required: false
            }
        ]
    },
    options: {
        cooldown: 5000
    },
    
    /**
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const mention = interaction.options.getUser('user');
        const targetUser = mention || interaction.user;
        const isSelf = targetUser.id === interaction.user.id;

        const socials = getUserSocials(targetUser.id);
        const platformList = ['tiktok', 'instagram', 'x'];
        let content = '';

        for (const platform of platformList) {
            const entries = socials[platform] || [];
            if (entries.length > 0) {
                content += `**${platform.charAt(0).toUpperCase() + platform.slice(1)}:**\n`;
                entries.forEach((url, i) => {
                    content += `${i + 1}. ${url}\n`;
                });
                content += '\n';
            }
        }

        if (!content) {
            content = isSelf 
                ? '*Kamu belum menambahkan sosial media apapun.*' 
                : `*${targetUser.username} belum menambahkan sosial media apapun.*`;
        }

        const components = [];

        if (isSelf) {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('sosmed_add')
                    .setLabel('Tambah')
                    .setEmoji('➕')
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId('sosmed_edit')
                    .setLabel('Edit')
                    .setEmoji('✏️')
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId('sosmed_delete')
                    .setLabel('Hapus')
                    .setEmoji('❌')
                    .setStyle(ButtonStyle.Danger)
            );

            components.push(row);
        }

        await interaction.reply({
            content: `📱 **Sosial Media ${isSelf ? 'Kamu' : targetUser.username}:**\n\n${content}`,
            components,
            ephemeral: true
        });
    }
}).toJSON();
