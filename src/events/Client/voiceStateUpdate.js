const { Events } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');

module.exports = {
    name: Events.VoiceStateUpdate,

    /**
     * @param {import('discord.js').VoiceState} oldState 
     * @param {import('discord.js').VoiceState} newState 
     */
    async execute(oldState, newState) {
        const targetChannelId = '1354589321511960755';
        const user = newState.member?.user;
        const guild = newState.guild;

        if (
            newState.channelId === targetChannelId &&
            oldState.channelId !== targetChannelId &&
            !user.bot
        ) {
            const connection = joinVoiceChannel({
                channelId: targetChannelId,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false,
            });

            const ttsUrl = googleTTS.getAudioUrl(`Halo masta ${user.username}`, {
                lang: 'id',
                slow: false,
            });

            const player = createAudioPlayer();
            const resource = createAudioResource(ttsUrl);

            connection.subscribe(player);
            player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                // Opsional: Disconnect kalau bot tidak perlu stay
                // connection.destroy();
            });
        }
    }
};
