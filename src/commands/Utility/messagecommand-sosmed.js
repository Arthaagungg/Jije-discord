const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { getUserSocials } = require("../../utils/sosmedStorage");

module.exports = new MessageCommand({
    name: "sosmed",
    description: "Lihat sosial media kamu atau orang lain.",

    /**
     * @param {DiscordBot} client
     * @param {Message} message
     */
    run: async (client, message) => {
        const target = message.mentions.users.first() || message.author;
        const isSelf = target.id === message.author.id;

        const socials = getUserSocials(target.id);
        const platforms = ['tiktok', 'instagram', 'x'];
        const embed = new EmbedBuilder()
            .setColor('#1DA1F2')
            .setTitle(`📱 Sosial Media ${isSelf ? "Kamu" : target.username}`)
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        let hasAny = false;

        for (const platform of platforms) {
            const list = socials[platform] || [];
            if (list.length > 0) {
                hasAny = true;
                embed.addFields({
                    name: `🌐 ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
                    value: list.map((url, i) => `\`${i + 1}.\` [Link](${url})`).join('\n'),
                    inline: false
                });
            }
        }

        if (!hasAny) {
            embed.setDescription(isSelf
                ? "*Kamu belum menambahkan sosial media apapun.*"
                : `*${target.username} belum menambahkan sosial media apapun.*`);
        }

        await message.reply({ embeds: [embed] });
    }
}).toJSON();
