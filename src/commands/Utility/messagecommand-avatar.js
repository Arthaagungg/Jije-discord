const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'avatar',
        description: 'Menampilkan avatar pengguna atau dengan efek magik.',
        aliases: ['ava'],
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
        const isMagik = args[0]?.toLowerCase() === 'magik';
        const targetUser = message.mentions.users.first() || message.author;

        const avatarURL = targetUser.displayAvatarURL({ format: 'png', size: 512 });

        const imageURL = isMagik
            ? `https://some-random-api.ml/canvas/magik?avatar=${encodeURIComponent(avatarURL)}`
            : targetUser.displayAvatarURL({ dynamic: true, size: 1024 });

        await message.reply({
            content: isMagik
                ? `🌀 Avatar **magik** dari ${targetUser.username}`
                : `🖼️ Avatar dari **${targetUser.username}**`,
            embeds: [{
                color: 0x00AEFF,
                image: {
                    url: imageURL
                },
                footer: {
                    text: `Diminta oleh ${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: new Date()
            }]
        });
    }
}).toJSON();
