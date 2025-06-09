const { Message, AttachmentBuilder, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { loadDictionary } = require("../../utils/dictionary");

module.exports = new MessageCommand({
    command: {
        name: 'kamus',
        description: 'Menampilkan seluruh isi kamus.\nContoh: `jjkamus`',
        aliases: []
    },
    options: {
    cooldown: 5000,
    feature: 'kamus'
  },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const kamus = loadDictionary();

        if (Object.keys(kamus).length === 0) {
            return message.reply({
                content: '📭 Kamus masih kosong.'
            });
        }

        let output = '';
        for (const [kata, arti] of Object.entries(kamus)) {
            output += `🔹 **${kata}**\n📝 _${arti}_\n\n`;
        }

        const totalKata = Object.keys(kamus).length;

        if (output.length > 1900) {
            const buffer = Buffer.from(`📘 Kamus Bot\n\n${output}`, 'utf-8');
            const file = new AttachmentBuilder(buffer, { name: 'kamus.txt' });

            return message.reply({
                content: '📄 Isi kamus terlalu panjang, dikirim sebagai file:',
                files: [file]
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('📘 Kamus Besar Bahasa Jije')
            .setDescription(output)
            .setColor(0x5865F2) // Discord Blurple
            .setFooter({ text: `📚 Total Entri: ${totalKata}`, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
}).toJSON();
