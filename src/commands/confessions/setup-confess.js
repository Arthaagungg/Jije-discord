const {
  Message,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionsBitField
} = require('discord.js');
const MessageCommand = require("../../structure/MessageCommand");
const DiscordBot = require("../../client/DiscordBot");
const supabase = require("../../utils/supabase");

module.exports = new MessageCommand({
  command: {
    name: 'setup-confess',
    description: 'Setup sistem confession',
    aliases: [],
    permissions: ['Administrator']
  },
  options: {
    cooldown: 5000,
    botDevelopers: true,
  },

  /**
   * @param {DiscordBot} client 
   * @param {Message} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {
    const guild = message.guild;
    const guildId = guild.id;

    const { data: existing, error } = await supabase
      .from('confession_settings')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error(error);
      return message.reply('❌ Gagal mengambil data dari database.');
    }

    if (existing) {
      await message.reply('⚠️ Sistem confession sudah ada. Ingin mengganti pengaturannya? (ya/tidak)');
      try {
        const collected = await message.channel.awaitMessages({
          filter: m => m.author.id === message.author.id && ['ya', 'tidak'].includes(m.content.toLowerCase()),
          max: 1,
          time: 15000
        });

        const reply = collected.first()?.content.toLowerCase();
        if (!reply || reply === 'tidak') {
          return message.reply('❌ Setup confession dibatalkan.');
        }

        // Hapus channel lama jika ada
        const oldChannel = guild.channels.cache.get(existing.channel_id);
        if (oldChannel) await oldChannel.delete().catch(() => null);
      } catch {
        return message.reply('❌ Tidak ada respon. Setup confession dibatalkan.');
      }
    }

    // Buat channel baru
    const channel = await guild.channels.create({
      name: 'confession',
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: guild.roles.everyone,
          allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        }
      ],
      reason: 'Setup confession bot'
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('💌 Anonymous Confession')
      .setDescription('Klik tombol di bawah untuk mengirimkan confession secara anonim.')
      .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confess_write')
        .setLabel('Write Confession')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });

    const { error: upsertError } = await client.supabase.from('confession_settings').upsert({
      guild_id: guildId,
      channel_id: channel.id,
      button_label: 'Write Confession',
      button_emoji: '📝',
      button_style: 'Primary',
      embed_title: '💌 Anonymous Confession',
      embed_description: 'Klik tombol di bawah untuk mengirimkan confession secara anonim.',
      footer_text: guild.name,
      footer_icon: guild.iconURL({ dynamic: true })
    });

    if (upsertError) {
      console.error(upsertError);
      return message.reply('❌ Gagal menyimpan pengaturan confession ke database.');
    }

    await message.reply('✅ Sistem confession berhasil di-setup.');
  }
}).toJSON();
