const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const Event = require('../../structure/Event');

module.exports = new Event({
  event: 'voiceStateUpdate',

  /**
   * @param {import('discord.js').Client} client 
   * @param {import('discord.js').VoiceState} oldState 
   * @param {import('discord.js').VoiceState} newState 
   */
  run: async (client, oldState, newState) => {
    const targetChannelId = '1354589321511960755';
    const user = newState.member?.user;
    const guild = newState.guild;

    // Cek jika user masuk ke VC target dan bukan bot
    if (
      newState.channelId === targetChannelId &&
      oldState.channelId !== targetChannelId &&
      !user?.bot
    ) {
      try {
        const connection = joinVoiceChannel({
          channelId: targetChannelId,
          guildId: guild.id,
          adapterCreator: guild.voiceAdapterCreator,
          selfDeaf: false,
        });

        // Tambahkan jeda alami dan pelafalan lebih baik
        const ttsText = `Halo...,${user.username}!`;
        const ttsUrl = googleTTS.getAudioUrl(ttsText, {
          lang: 'id',
          speed: 0.9, // Lebih lambat sedikit
          host: 'https://translate.google.com',
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(ttsUrl);
        connection.subscribe(player);

        // Tunggu 2 detik sebelum bicara
        setTimeout(() => {
          player.play(resource);
        }, 2000);

        // Opsional: disconnect setelah selesai bicara
        player.on(AudioPlayerStatus.Idle, () => {
        });

        player.on('error', err => {
          console.error('❌ Player error:', err);
          connection.destroy();
        });

      } catch (err) {
        console.error('❌ Voice join/playback error:', err);
      }
    }
  }
}).toJSON();
