const { Message, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js');
const MessageCommand = require("../../structure/MessageCommand");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new MessageCommand({
  command: {
    name: 'setup-confess',
    description: 'Setup sistem confession',
    aliases: [],
    permissions: ['Administrator']
  },
  options: {
    cooldown: 5000,
    botDevelopers : true,
  },

  /**
   * 
   * @param {DiscordBot} client 
   * @param {Message} message 
   * @param {string[]} args 
   */
  run: async (client, message, args) => {

    const guildId = message.guild.id;
    const existing = await client.supabase
      .from('confession_settings')
      .select('*')
      .eq('guild_id', guildId)
      .single();

    if (existing.data) {
      const confirmMsg = await message.reply('⚠️ Sistem confession sudah di-setup sebelumnya. Ingin mengganti pengaturannya? (ya/tidak)');
      const filter = m => m.author.id === message.author.id && ['ya', 'tidak'].includes(m.content.toLowerCase());
      const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000 });

      const response = collected.first()?.content.toLowerCase();
      if (!response || response === 'tidak') return message.reply('❌ Setup confession dibatalkan.');
    }

    const channel = await message.guild.channels.create({
      name: 'confession',
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone,
          allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('💌 Anonymous Confession')
      .setDescription('Klik tombol di bawah untuk mengirimkan confession secara anonim.')
      .setFooter({ text: 'Setup Confession', iconURL: message.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('confess_write')
        .setLabel('Write Confession')
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });

    const upsert = await client.supabase.from('confession_settings').upsert({
      guild_id: guildId,
      channel_id: channel.id,
      button_label: 'Write Confession',
      button_emoji: '📝',
      button_style: 'Primary',
      embed_title: '💌 Anonymous Confession',
      embed_description: 'Klik tombol di bawah untuk mengirimkan confession secara anonim.',
      footer_text: 'Setup Confessions',
      footer_icon: message.guild.iconURL({ dynamic: true })
    });

    if (upsert.error) {
      console.error(upsert.error);
      return message.reply('❌ Gagal menyimpan pengaturan confession ke database.');
    }

    await message.reply('✅ Sistem confession berhasil di-setup.');
  }
}).toJSON();
