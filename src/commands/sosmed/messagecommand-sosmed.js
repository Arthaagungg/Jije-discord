const { EmbedBuilder } = require('discord.js');
const sosmedDb = require('../utils/sosmedDb');

module.exports = {
  name: 'sosmed',
  aliases: [],
  description: 'Lihat sosial media kamu yang tersimpan.',
  usage: '!sosmed',

  /**
   * 
   * @param {import('discord.js').Message} message 
   */
  run: async (message) => {
    const userId = message.author.id;
    const socials = sosmedDb.getUserSocials(userId);

    if (Object.keys(socials).length === 0) {
      return message.reply('📭 Kamu belum menyimpan sosial media apapun.');
    }

    const embed = new EmbedBuilder()
      .setColor('#1DA1F2')
      .setTitle(`📱 Sosial Media ${message.member?.nickname || message.author.username}`)
      .setDescription(
        Object.entries(socials)
          .map(([platform, username]) => {
            let url;
            switch (platform.toLowerCase()) {
              case 'tiktok':
                url = `https://www.tiktok.com/@${username}`; break;
              case 'instagram':
                url = `https://www.instagram.com/${username}`; break;
              case 'x':
              case 'twitter':
                url = `https://twitter.com/${username}`; break;
              default:
                url = `https://${platform}.com/${username}`;
            }

            return `🔗 **${platform}**: [@${username}](${url})`;
          })
          .join('\n')
      )
      .setFooter({ text: 'Gunakan !sosmed add <platform> <username> untuk menambahkan.' });

    message.reply({ embeds: [embed] });
  }
};
