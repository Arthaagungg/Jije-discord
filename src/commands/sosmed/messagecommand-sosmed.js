const { Message, MessageMentions, MessageActionRow, MessageButton } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const MessageCommand = require('../../structure/MessageCommand');
const socialManager = require('../../utils/socialManager');

/**
 * Format embed sosial media
 */
function formatSocialEmbed(username, avatarURL, socials) {
    const platformEmoji = {
        instagram: '📸 Instagram',
        tiktok: '🎵 TikTok',
        x: '🐦 X'
    };

    const description = socials.length
        ? socials.map((s, i) => `**${platformEmoji[s.platform] || s.platform}:** [Link](${s.url})`).join('\n')
        : '_Belum menambahkan sosial media_';

    return {
        color: 0x00B2FF,
        title: `📱 Sosial Media ${username}`,
        description,
        thumbnail: {
            url: avatarURL
        },
        timestamp: new Date()
    };
}

module.exports = new MessageCommand({
    command: {
        name: 'sosmed',
        description: 'Menampilkan sosial media kamu atau user lain.',
        aliases: ['social'],
        permissions: ['SendMessages']
    },
    options: {
        cooldown: 5000
    },

    /**
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const targetUser = message.mentions.users.first() || message.author;
        const socials = socialManager.getUserSocials(targetUser.id);

        const embed = formatSocialEmbed(
            targetUser.username,
            targetUser.displayAvatarURL({ dynamic: true }),
            socials
        );

        const row = {
            type: 1, // ActionRow
            components: [
                {
                    type: 2, // Button
                    style: 1, // PRIMARY
                    custom_id: `sosmed_manage_${targetUser.id}`,
                    label: 'Kelola Sosmed',
                    emoji: '⚙️'
                }
            ]
        };

        await message.reply({
            embeds: [embed],
            components: [row]
        });
    }
}).toJSON();
