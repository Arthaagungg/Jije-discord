const { MessageEmbed } = require("discord.js");
const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'ping',
        description: 'Check ping !',
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

        let color = '#43B581'; // Green
        let status = '🟢 Excellent';

        if (ping > 200) {
            color = '#FAA61A'; // Orange
            status = '🟡 Average';
        }
        if (ping > 400) {
            color = '#F04747'; // Red
            status = '🔴 Poor';
        }

        const embed = new MessageEmbed()
            .setTitle('🏓 Pong!')
            .setDescription(`**Latency:** \`${ping}ms\`\n**Status:** ${status}`)
            .setColor(color)
            .setFooter({ text: 'DiscordBot • Latency Checker', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
}).toJSON();
