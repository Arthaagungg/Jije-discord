const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } = require("discord.js"); const DiscordBot = require("../../client/DiscordBot"); const MessageCommand = require("../../structure/MessageCommand");

const CONFESSION_CHANNEL_ID = "1377404766673702995";

module.exports = new MessageCommand({ command: { name: 'setting', description: 'Set up confession system', aliases: [], permissions: ['Administrator'] }, options: { cooldown: 3000 },
                                     options: {
                                         botDevelopers: true
                                     },

/**

@param {DiscordBot} client

@param {Message} message

@param {string[]} args */ run: async (client, message, args) => { if (!args[0] || args[0].toLowerCase() !== 'confess') return message.reply('Format perintah salah. Gunakan !setting confess');


const channel = message.guild.channels.cache.get(CONFESSION_CHANNEL_ID);
if (!channel || channel.type !== ChannelType.GuildText) return message.reply("Channel tidak ditemukan atau bukan text channel.");

// Hapus tombol lama
const messages = await channel.messages.fetch({ limit: 10 });
for (const msg of messages.values()) {
  if (msg.author.id === client.user.id && msg.components.length > 0) {
    const newRows = msg.components.map(row => {
      const newRow = ActionRowBuilder.from(row);
      newRow.components = newRow.components.map(btn => ButtonBuilder.from(btn).setDisabled(true));
      return newRow;
    });
    await msg.edit({ components: newRows }).catch(() => null);
  }
}

const embed = new EmbedBuilder()
  .setColor(0x5865F2)
  .setTitle('💌 Anonymous Confession')
  .setDescription('Klik tombol di bawah untuk mengirimkan confession secara anonim.')
  .setFooter({ text: `Temen - Temen Jije Confession`, iconURL: message.guild.iconURL({ dynamic: true }) })
  .setTimestamp();

const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('confess_write')
    .setLabel('Write Confession')
    .setEmoji('📝')
    .setStyle(ButtonStyle.Primary)
);

await channel.send({ embeds: [embed], components: [row] });
await message.reply('✅ Sistem confession berhasil diatur.');

} }).toJSON();

