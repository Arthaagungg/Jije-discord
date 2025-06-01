const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { loadDictionary, saveDictionary } = require("../../utils/dictionary");

module.exports = new MessageCommand({
    command: {
        name: 'hapus',
        description: 'Menghapus kata dari kamus. Contoh: `jjhapus ngab`',
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
        const kata = args[0]?.toLowerCase();

        if (!kata) {
            return message.reply({
                embeds: [{
                    color: 0xF04747,
                    title: '❌ Format Salah',
                    description: 'Gunakan format seperti ini:\n`jjhapus ngab`',
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    timestamp: new Date()
                }]
            });
        }

        const kamus = loadDictionary();

        if (!kamus[kata]) {
            return message.reply({
                embeds: [{
                    color: 0xFAA61A,
                    title: '⚠️ Kata Tidak Ditemukan',
                    description: `Kata **${kata}** tidak tersedia di kamus.`,
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true })
                    },
                    timestamp: new Date()
                }]
            });
        }

        delete kamus[kata];
        saveDictionary(kamus);

        const replyMessage = await message.reply({
            embeds: [{
                color: 0x43B581,
                title: '✅ Kata Dihapus',
                description: `Kata **${kata}** berhasil dihapus dari kamus.`,
                footer: {
                    text: `Diminta oleh ${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true })
                },
                timestamp: new Date()
            }]
        });

        // Hapus command & respon dalam 10 detik
        setTimeout(() => {
            message.delete().catch(() => {});
            replyMessage.delete().catch(() => {});
        }, 10000);
    }
}).toJSON();
