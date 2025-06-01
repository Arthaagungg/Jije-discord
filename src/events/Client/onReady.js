const { joinVoiceChannel } = require('@discordjs/voice');
const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");

module.exports = new Event({
    event: 'ready',
    once: true,
    run: async (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.");

        const voiceChannelId = '1368490066120409172';

        // Cari guild yang memiliki voice channel tersebut
        const guild = client.guilds.cache.find(g => g.channels.cache.has(voiceChannelId));
        if (!guild) return console.error('[VOICE] Guild tidak ditemukan.');

        const channel = guild.channels.cache.get(voiceChannelId);
        if (!channel || channel.type !== 2) return console.error('[VOICE] Channel voice tidak valid.');

        try {
            joinVoiceChannel({
                channelId: voiceChannelId,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
                selfDeaf: false
            });

            console.log(`🎤 Bot berhasil join ke voice channel "${channel.name}"`);
        } catch (err) {
            console.error('[VOICE] Gagal join voice channel:', err);
        }
    }
}).toJSON();