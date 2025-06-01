const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const { loadDictionary } = require("../../utils/dictionary");

module.exports = new MessageCommand({
    command: {
        name: 'arti',
        description: 'Menampilkan arti dari kata dalam kamus.\nContoh: `jjarti ngab`',
        aliases: []
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
                content: '❗ Masukkan kata yang ingin dicari.\nContoh: `jjarti ngab`'
            });
        }

        const kamus = loadDictionary();

        if (!kamus[kata]) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(0xED4245) // merah
                        .setTitle('🔍 Kata Tidak Ditemukan')
                        .setDescription(`Kata **${kata}** belum ada di kamus besar bahasa jije.`)
                        .setTimestamp()
                ]
            });
        }

        const embed = new EmbedBuilder()
            .setColor(0x57F287) // hijau soft
            .setTitle(`📖 Arti dari: ${kata}`)
            .setDescription(`> ${kamus[kata]}`)
        .setFooter({ text: `📚 Gunakan jjkamus untuk melihat semua.`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
}).toJSON();