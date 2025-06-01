const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'ping',
        description: 'Menampilkan kecepatan koneksi.',
        aliases: ['p'],
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
        const ping = client.ws.ping;

        // Tentukan status dan warna
        let status = '🟢 Sangat Cepat';
        let color = 0x43B581; // Hijau

        if (ping > 200) {
            status = '🟡 Cukup Stabil';
            color = 0xFAA61A; // Kuning
        }

        if (ping > 400) {
            status = '🔴 Sangat Lambat';
            color = 0xF04747; // Merah
        }

        await message.reply({
            content: '📶 Berikut detail latensi bot:',
            embeds: [{
                color,
                title: '🏓 Pong!',
                description: `**Latensi:** \`${ping}ms\`\n**Status:** ${status}`,
                footer: {
                    text: `Diminta oleh ${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: new Date()
            }]
        });
    }
}).toJSON();
