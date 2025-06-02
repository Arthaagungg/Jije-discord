const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const Event = require('../../structure/Event'); // Sesuaikan path kalau berbeda

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

    // Cek kalau user masuk ke VC target dan bukan bot
    if (
      newState.channelId === targetChannelId &&
      oldState.channelId !== targetChannelId &&
      !user?.bot
    ) {
      const connection = joinVoiceChannel({
        channelId: targetChannelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
      });

      const ttsUrl = googleTTS.getAudioUrl(`Halo, Selamat datang ${user.username}!`, {
        lang: 'id',
        speed: 0.4,
        host: 'https://translate.google.com',
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(ttsUrl);

      connection.subscribe(player);
      player.play(resource);

      player.on(AudioPlayerStatus.Idle, () => {
      });

      player.on('error', err => {
        console.error('Player error:', err);
        connection.destroy();
      });
    }
  }
}).toJSON();
