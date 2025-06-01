const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'userinfo',
        description: 'Menampilkan informasi tentang pengguna yang disebut atau diri kamu sendiri.',
        aliases: ['info', 'whois'],
        permissions: ['SendMessages']
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || message.member;
        const user = member.user;

        const roles = member.roles.cache
            .filter(role => role.id !== message.guild.id)
            .map(role => role.toString())
            .join(', ') || 'Tidak ada';

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .addFields(
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '👤 Username', value: `${user.username}`, inline: true },
                { name: '🏷️ Nickname', value: member.nickname || 'Tidak ada', inline: true },
                { name: '📆 Akun Dibuat', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: false },
                { name: '📥 Bergabung Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: false },
                { name: '🎭 Role', value: roles, inline: false }
            )
            .setFooter({ text: `Diminta oleh ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
}).toJSON();