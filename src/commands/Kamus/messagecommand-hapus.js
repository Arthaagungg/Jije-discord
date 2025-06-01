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
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const kata = args[0]?.toLowerCase();

        if (!kata) {
            return message.reply({
                content: 'Format salah. Contoh: `jjhapus ngab`'
            });
        }

        const kamus = loadDictionary();

        if (!kamus[kata]) {
            return message.reply({
                content: `Kata **${kata}** tidak ditemukan di kamus.`
            });
        }

        delete kamus[kata];
        saveDictionary(kamus);

        return message.reply({
            content: `Kata **${kata}** berhasil dihapus dari kamus.`
        });
    }
}).toJSON();