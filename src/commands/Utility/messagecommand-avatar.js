const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'avatar',
        description: 'Menampilkan avatar pengguna yang disebut atau avatar kamu sendiri.',
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
        // Cek apakah ada mention
        const targetUser = message.mentions.users.first() || message.author;

        await message.reply({
            content: `🖼️ Avatar dari **${targetUser.username}**`,
            embeds: [{
                color: 0x00AEFF,
                image: {
                    url: targetUser.displayAvatarURL({ dynamic: true, size: 1024 })
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