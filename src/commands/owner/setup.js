const { Message, PermissionsBitField, ChannelType, EmbedBuilder } = require("discord.js"); const MessageCommand = require("../../structure/MessageCommand"); const DiscordBot = require("../../client/DiscordBot");

module.exports = new MessageCommand({ command: { name: 'setup', description: 'Setup awal bot saat pertama kali masuk ke server.', aliases: [] }, options: { cooldown: 5000, botOwner: true },

/**

@param {DiscordBot} client

@param {Message} message

@param {string[]} args */ run: async (client, message, args) => { if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) { return message.reply('❌ Kamu harus memiliki permission Administrator untuk menjalankan setup.'); }


const setupMessage = await message.reply('🔧 Memulai setup awal bot. Mohon tunggu sebentar...');

try {
  // Simulasi progress 30 detik
  for (let i = 0; i <= 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 10000)); // 10 detik per iterasi
    await setupMessage.edit(`⏳ Setup bot sedang berjalan... (${i * 10}s / 30s)`);
  }

  // 1. Membuat role Bot Facility
  const role = await message.guild.roles.create({
    name: 'Bot Facility',
    permissions: [
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.ManageMessages,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.EmbedLinks,
      PermissionsBitField.Flags.AttachFiles,
      PermissionsBitField.Flags.UseApplicationCommands
    ],
    reason: 'Setup awal bot - Role Bot Facility'
  });

  // Berikan role ke bot
  const botMember = await message.guild.members.fetchMe();
  await botMember.roles.add(role);

  // 2. Membuat channel private
  const channel = await message.guild.channels.create({
    name: 'maintenance-bot',
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: message.guild.roles.everyone,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: botMember.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.EmbedLinks
        ]
      }
    ]
  });

  // 3. Kirim embed ke channel dan pin
  const embed = new EmbedBuilder()
    .setTitle('🛠 Informasi Maintenance Bot')
    .setDescription('Jangan hapus channel ini. Channel ini digunakan untuk **update, maintenance, dan pengumuman penting terkait bot.**')
    .setColor(0x5865F2)
    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
    .setTimestamp();

  const sent = await channel.send({ embeds: [embed] });
  await sent.pin();

  // 4. Simpan ID channel ke Supabase
  await client.supabase
    .from('settings')
    .upsert({
      guild_id: message.guild.id,
      maintenance_channel_id: channel.id
    });

  await setupMessage.edit('✅ Setup awal bot berhasil diselesaikan. Selamat menggunakan bot!');

} catch (err) {
  console.error(err);
  await setupMessage.edit('❌ Terjadi kesalahan saat melakukan setup bot.');
}

} }).toJSON();

