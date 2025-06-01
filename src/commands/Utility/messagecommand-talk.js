const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'talk',
        description: 'Bot akan bicara di voice channel dengan teks yang kamu masukkan.',
        aliases: [],
        permissions: ['SendMessages']
    },
    options: {
        cooldown: 3000
    },

    /**
     * @param {DiscordBot} client
     * @param {import('discord.js').Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const text = args.join(' ');
        const userVC = message.member.voice.channel;

        if (!userVC) {
            return message.reply({
                embeds: [{
                    color: 0xF04747,
                    title: '🔇 Gagal!',
                    description: 'Kamu harus join voice channel dulu untuk menggunakan perintah ini.',
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true }),
                    },
                    timestamp: new Date()
                }]
            });
        }

        if (!text) {
            return message.reply({
                embeds: [{
                    color: 0xFAA61A,
                    title: '❌ Teks Kosong!',
                    description: 'Kamu harus memasukkan teks. Contoh: `!talk halo semuanya`',
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true }),
                    },
                    timestamp: new Date()
                }]
            });
        }

        if (text.length > 200) {
            return message.reply({
                embeds: [{
                    color: 0xFAA61A,
                    title: '⚠️ Teks Terlalu Panjang!',
                    description: 'Maksimal 200 karakter untuk perintah ini.',
                    footer: {
                        text: `Diminta oleh ${message.author.username}`,
                        icon_url: message.author.displayAvatarURL({ dynamic: true }),
                    },
                    timestamp: new Date()
                }]
            });
        }

        // Dapatkan URL audio TTS Google
        const ttsURL = googleTTS.getAudioUrl(text, {
            lang: 'id',
            slow: false,
            host: 'https://translate.google.com',
        });

        // Join voice channel
        const connection = joinVoiceChannel({
            channelId: userVC.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        // Buat audio player dan resource
        const player = createAudioPlayer();
        const resource = createAudioResource(ttsURL);

        player.play(resource);
        connection.subscribe(player);

        // Kirim embed balasan konfirmasi
        await message.reply({
            embeds: [{
                color: 0x00AEFF,
                title: '🗣️ Sedang berbicara di Voice Channel',
                description: `Saya akan mengucapkan:\n\n> ${text}`,
                footer: {
                    text: `Diminta oleh ${message.author.username}`,
                    icon_url: message.author.displayAvatarURL({ dynamic: true }),
                },
                timestamp: new Date()
            }]
        });

        // Hapus pesan command supaya chat lebih rapi
        message.delete().catch(() => {});

        // Auto leave voice channel setelah selesai bicara
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        player.on('error', error => {
            console.error('🔴 Error saat memutar audio:', error);
            connection.destroy();
        });
    }
});
