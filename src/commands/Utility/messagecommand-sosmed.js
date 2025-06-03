const { Component } = require('../../structure/Component');
const { getUserSocials } = require('../../utils/sosmedStorage');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = new Component({
  name: 'messagecommand-sosmed',
  description: 'Lihat sosial media kamu atau orang lain',

  /**
   * @param {import('discord.js').Message} message
   */
  async run(message) {
    const mention = message.mentions.users.first();
    const targetUser = mention || message.author;
    const isSelf = targetUser.id === message.author.id;

    const socials = getUserSocials(targetUser.id);
    let description = '';

    const platformList = ['tiktok', 'instagram', 'x'];
    for (const platform of platformList) {
      const entries = socials[platform] || [];
      if (entries.length > 0) {
        description += `**${platform.charAt(0).toUpperCase() + platform.slice(1)}:**\n`;
        entries.forEach((url, index) => {
          description += `${index + 1}. ${url}\n`;
        });
        description += '\n';
      }
    }

    if (!description) {
      description = `*${isSelf ? 'Kamu belum' : `${targetUser.username} belum`} menambahkan sosial media apapun.*`;
    }

    const components = [];

    if (isSelf) {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`sosmed_add`)
          .setLabel('Tambah')
          .setStyle(ButtonStyle.Success)
          .setEmoji('➕'),

        new ButtonBuilder()
          .setCustomId(`sosmed_edit`)
          .setLabel('Edit')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('✏️'),

        new ButtonBuilder()
          .setCustomId(`sosmed_delete`)
          .setLabel('Hapus')
          .setStyle(ButtonStyle.Danger)
          .setEmoji('❌')
      );
      components.push(row);
    }

    await message.reply({
      content: `📱 **Sosial Media ${isSelf ? 'Kamu' : targetUser.username}:**\n\n${description}`,
      components,
    });
  },
});
