const { EmbedBuilder, Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const os = require('os');
const moment = require('moment-duration-format');
const momentLib = require('moment');
const config = require("../../config");

// Format uptime
function formatUptime(ms) {
    return momentLib.duration(ms).format("D [day], H [hr], m [min], s [sec]");
}

module.exports = new MessageCommand({
    command: {
        name: 'running',
        description: 'Show bot uptime and info',
        aliases: ['uptime', 'status']
    },
    options: {
        botDevelopers: true
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const uptime = formatUptime(client.uptime);

        // Ambil info developer dari ID
        const developerTags = config.users.developers?.map(id => {
            const user = client.users.cache.get(id);
            return user ? user.tag : `Unknown (${id})`;
        }) || ['None'];

        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setTitle('🖥️ Bot Status !')
            .addFields(
                { name: '⏱️ Uptime', value: uptime, inline: true },
                { name: '🤖 Bot Name', value: client.user.username, inline: true },
                { name: '🛰️ Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: '🌐 Servers', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👥 Users', value: `${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}`, inline: true },
                { name: '⚙️ Node.js', value: process.version, inline: true },
                { name: '📦 Discord.js', value: require('discord.js').version, inline: true },
                { name: '🧠 Platform', value: os.platform(), inline: true },
                { name: '👨‍💻 Developers', value: developerTags.join('\n'), inline: false },
            )
            .setFooter({ text: `Requested by ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
}).toJSON();