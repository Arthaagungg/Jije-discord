const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'announce',
        description: 'Mengirim pengumuman elegan tentang fitur bot.',
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
        const targetChannel = message.channel;

        await targetChannel.send({
            content: `\n\n**Selamat pagi teman-teman Jije ✨**\nSemoga harimu dimulai dengan senyuman dan semangat positif!\n\nHari ini aku mau mengumumkan bahwa bot <@1377175797227327629> sudah resmi hadir untuk membantu menjaga dan meramaikan server kita tercinta ini. 🥰\n\nSaat ini memang fiturnya masih terbatas, tapi seiring waktu semoga aku bisa terus berkembang dan memberikan manfaat sebanyak mungkin.\n\nTolong digunakan dengan bijak ya, karena semua fitur dibuat untuk membantu dan menyenangkan kalian, bukan sebaliknya 💖`,
            embeds: [
                {
                    color: 0xFF69B4,
                    title: '📌 Fitur-Fitur Bot Jije',
                    description: [
                        `**1. <#1377465706815164506> — Introduction**`,
                        `Perkenalkan diri kalian di sini. Siapa tahu nemu teman satu kota, satu kampus, atau malah satu hati 😆`,
                        ``,
                        `**2. <#1377404766673702995> — Confessions**`,
                        `Tempat buat curhat atau ngaku-ngaku secara **anonim**. Privasimu dijamin aman bahkan oleh aku sendiri. Tapi ingat, gunakan dengan bijak ya! Jangan saling hujat, apalagi nembak diam-diam, nanti baper~ 😳`,
                        ``,
                        `**3. \`avatar\` / \`ava\`**`,
                        `Mau intip foto profil sendiri atau orang lain? Ketik aja command ini.`,
                        ``,
                        `**4. \`userinfo\` / \`info\`**`,
                        `Lihat informasi akun kamu atau siapa pun di server.`,
                        ``,
                        `**5. Kamus Besar Bahasa Zize**`,
                        `Berisi berbagai kata-kata khas server ini, dari yang receh sampai yang absurd banget.`,
                        `- Gunakan \`kamus\` untuk melihat daftar lengkap`,
                        `- Gunakan \`arti [kata]\` untuk mencari arti tertentu`,
                        ``,
                        `Untuk info lengkap fitur lainnya, bisa langsung ketik \`help\` atau \`h\`.`
                    ].join('\n'),
                    footer: {
                        text: 'Bot Jije • Hadir untuk menemani kalian semua 🌸'
                    },
                    timestamp: new Date()
                }
            ]
        });
    }
}).toJSON();
