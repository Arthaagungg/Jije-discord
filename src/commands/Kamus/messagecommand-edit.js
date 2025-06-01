const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { loadDictionary, saveDictionary } = require("../../utils/dictionary");

module.exports = new MessageCommand({
    command: {
        name: 'edit',
        description: 'Mengubah arti dari kata di kamus. Contoh: `jjedit kata=ngab arti=sapaan buat bro`',
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
                    description: 'Gunakan format seperti ini:\n`jjedit kata=ngab arti=sapaan buat bro`',
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

        if (!kamus[kata]) {
            return message.reply({
                embeds: [{
                    color: 0xFAA61A,
                    title: '⚠️ Kata Tidak Ditemukan',
                    description: `Kata **${kata}** tidak ditemukan di kamus.`,
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
                title: '✏️ Arti Diubah',
                description: `Arti dari kata **${kata}** berhasil diubah menjadi:\n_${arti}_`,
                footer: {
                    text: `Diminta oleh ${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: new Date()
            }]
        });

        // Auto-delete command & response dalam 10 detik
        setTimeout(() => {
            message.delete().catch(() => {});
            replyMessage.delete().catch(() => {});
        }, 10000);
    }
}).toJSON();
