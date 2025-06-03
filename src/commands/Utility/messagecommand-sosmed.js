const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { getUserSocials } = require("../../utils/sosmedStorage");

module.exports = new MessageCommand({
    name: "sosmed",
    description: "Lihat sosial media kamu atau orang lain",

    /**
     * @param {DiscordBot} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        const mention = message.mentions.users.first();
        const targetUser = mention || message.author;
        const isSelf = targetUser.id === message.author.id;

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

        await message.reply({
            content: `📱 **Sosial Media ${isSelf ? 'Kamu' : targetUser.username}:**\n\n${content}`
        });
    }
}).toJSON();
