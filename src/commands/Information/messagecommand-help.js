const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const config = require("../../config");

module.exports = new MessageCommand({
    command: {
        name: 'help',
        description: 'Menampilkan daftar command yang tersedia.',
        aliases: ['h', 'hlp']
    },
    options: {
        cooldown: 10000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const prefix = client.database.ensure('prefix-' + message.guild.id, config.commands.prefix);

        const isDeveloper = (
            config.users.ownerId === message.author.id ||
            config.users.developers?.includes(message.author.id)
        );

        const commandFields = client.collection.message_commands
            .filter((cmd) => {
                const options = cmd.options || {};
                if (!isDeveloper && (options.botOwner || options.botDevelopers)) {
                    return false;
                }
                return true;
            })
            .map((cmd) => {
                const name = cmd.command.name;
                const aliases = cmd.command.aliases || [];
                const aliasText = aliases.length > 0 ? ` / ${aliases.map(a => `${prefix}${a}`).join(' / ')}` : '';
                const fullCommand = `🔹 ${prefix}${name}${aliasText}`;

                const options = cmd.options || {};
                const isDevCommand = options.botOwner || options.botDevelopers;

                let desc = cmd.command.description || 'Tidak ada deskripsi.';
                if (isDeveloper && isDevCommand) desc += ' 🛠️ **[Developer Only]**';

                return {
                    name: fullCommand,
                    value: desc,
                    inline: false
                };
            });

        const embed = new EmbedBuilder()
            .setColor(0x00AEFF)
            .setTitle('📖 Daftar Perintah Bot')
            .setDescription(isDeveloper ? 'Mode: 🧠 **Developer**\nBerikut semua perintah yang tersedia:' : 'Berikut adalah semua perintah yang bisa kamu gunakan:')
            .addFields(commandFields)
            .setFooter({ text: `Diminta oleh ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    }
}).toJSON();