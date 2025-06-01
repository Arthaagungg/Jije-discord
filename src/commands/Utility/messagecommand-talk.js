const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');

module.exports = new MessageCommand({
    command: {
        name: 'talk',
        description: 'Bot akan bicara di voice channel.',
        aliases: [],
        permissions: ['SendMessages']
    },
    options: {
        cooldown: 3000
    },

    async run(client, message, args) {
        const text = args.join(' ');
        const userVC = message.member.voice.channel;

        if (!userVC) {
            return message.reply('🔇 Kamu harus join voice channel dulu!');
        }

        if (!text) {
            return message.reply('❌ Teks tidak boleh kosong. Contoh: `!talk halo semua`');
        }

        if (text.length > 200) {
            return message.reply('⚠️ Teks terlalu panjang (maks 200 karakter).');
        }

        // Dapatkan URL TTS
        const ttsURL = googleTTS.getAudioUrl(text, {
            lang: 'id',
            slow: false,
            host: 'https://translate.google.com',
        });

        // Join ke voice
        const connection = joinVoiceChannel({
            channelId: userVC.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
        });

        // Bikin audio player dan mainkan
        const player = createAudioPlayer();
        const resource = createAudioResource(ttsURL);

        player.play(resource);
        connection.subscribe(player);

        // Hapus command user agar lebih rapi
        message.delete().catch(() => {});

        // Auto leave setelah selesai bicara
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });

        player.on('error', error => {
            console.error('🔴 Error saat memutar audio:', error);
            connection.destroy();
        });
    }
});
