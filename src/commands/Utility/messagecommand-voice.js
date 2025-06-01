const { Message } = require("discord.js");
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

let currentVoiceInfo = null; // { userId: string, channelId: string }

module.exports = new MessageCommand({
  command: {
    name: 'voice',
    description: 'Join or leave voice channel',
    aliases: ['vc'],
    permissions: ['Connect', 'Speak']
  },
  options: {
    cooldown: 5000
  },

  /**
   * @param {DiscordBot} client
   * @param {Message} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const subCommand = args[0]?.toLowerCase();
    const member = message.member;
    const voiceChannel = member?.voice?.channel;

    if (subCommand === 'join') {
      if (!voiceChannel) {
        return message.reply('❌ Kamu harus join voice channel dulu biar aku bisa ikut!');
      }

      if (currentVoiceInfo) {
        return message.reply(`📢 Aku sudah di pois <#${currentVoiceInfo.channelId}> bareng <@${currentVoiceInfo.userId}>. Jangan panggil-panggil, aku lagi gibah.`);
      }

      try {
        joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: message.guild.id,
          adapterCreator: message.guild.voiceAdapterCreator,
          selfDeaf: false,
        });

        currentVoiceInfo = {
          userId: message.author.id,
          channelId: voiceChannel.id,
        };

        return message.reply(`✅ Aku udah join ke voice channel kamu: **${voiceChannel.name}**.`);
      } catch (error) {
        console.error('❌ Error saat join voice channel:', error);
        return message.reply('❌ Gagal join ke voice channel. Cek izin bot atau coba lagi.');
      }

    } else if (subCommand === 'leave') {
      const botVoiceChannel = message.guild.members.me.voice.channel;

      if (!botVoiceChannel) {
        return message.reply('😒 Aku ga di pois, kenapa nyuruh keluar?');
      }

      if (!currentVoiceInfo || currentVoiceInfo.userId !== message.author.id) {
        return message.reply('❌ Kamu bukan orang yang ngajak aku ke pois, jadi ga bisa nyuruh aku keluar.');
      }

      try {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) connection.destroy();

        currentVoiceInfo = null;
        return message.reply('👋 Aku udah keluar dari voice channel.');
      } catch (error) {
        console.error('❌ Error saat keluar dari voice:', error);
        return message.reply('❌ Gagal keluar dari voice channel. Coba lagi nanti.');
      }

    } else {
      return message.reply('❗ Gunakan `!voice join` untuk nyuruh aku join atau `!voice leave` buat nyuruh aku keluar.');
    }
  }
}).toJSON();