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
     * 
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
                content: 'Format salah. Contoh: `jjubah kata=ngab arti=sapaan buat bro`'
            });
        }

        const kata = kataMatch[1].toLowerCase();
        const arti = artiMatch[1];

        const kamus = loadDictionary();

        if (!kamus[kata]) {
            return message.reply({
                content: `Kata **${kata}** tidak ditemukan di kamus.`
            });
        }

        kamus[kata] = arti;
        saveDictionary(kamus);

        return message.reply({
            content: `Arti dari kata **${kata}** berhasil diubah menjadi: _${arti}_`
        });
    }
}).toJSON();