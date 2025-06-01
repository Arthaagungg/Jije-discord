const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { loadDictionary, saveDictionary } = require("../../utils/dictionary");

module.exports = new MessageCommand({
    command: {
        name: 'tambah',
        description: 'Menambahkan kata baru ke kamus. Contoh: `jjtambah kata=ngab arti=sapaan khas anak jaksel`',
        aliases: []
    },
    options: {
        botDevelopers: true
    },

    /**
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const input = args.join(' ');

        const kataMatch = input.match(/kata=(.*?)\s/);
        const artiMatch = input.match(/arti=(.*)/);

        if (!kataMatch || !artiMatch) {
            return message.reply({
                embeds: [{
                    color: 0xF04747,
                    title: '❌ Format Salah',
                    description: 'Gunakan format seperti ini:\n`jjtambah kata=ngab arti=sapaan khas anak jaksel`',
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    timestamp: new Date()
                }]
            });
        }

        const kata = kataMatch[1].toLowerCase();
        const arti = artiMatch[1];

        const kamus = loadDictionary();

        if (kamus[kata]) {
            return message.reply({
                embeds: [{
                    color: 0xFAA61A,
                    title: '⚠️ Kata Sudah Ada',
                    description: `Kata **${kata}** sudah tersedia di kamus.`,
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    timestamp: new Date()
                }]
            });
        }

        kamus[kata] = arti;
        saveDictionary(kamus);

        const replyMessage = await message.reply({
            embeds: [{
                color: 0x43B581,
                title: '✅ Kata Ditambahkan',
                description: `**${kata}** berhasil ditambahkan ke kamus!\n\n**Arti:** _${arti}_`,
                footer: {
                    text: `Diminta oleh ${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: new Date()
            }]
        });

        // Hapus command & balasan setelah 10 detik
        setTimeout(() => {
            message.delete().catch(() => {});
            replyMessage.delete().catch(() => {});
        }, 10000);
    }
}).toJSON();
