const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');
const Component = require('../../structure/Component');
const socialManager = require('../../utils/socialManager');
const DiscordBot = require('../../client/DiscordBot');

module.exports = new Component({
  customId: 'sosmed_modal_add',
  type: 'modal',

  /**
   * 
   * @param {DiscordBot} client 
   * @param {import('discord.js').ModalSubmitInteraction} interaction 
   */
  run: async (client, interaction) => {
    const userId = interaction.user.id;

    const platform = interaction.fields.getTextInputValue('platform').trim().toLowerCase();
    const url = interaction.fields.getTextInputValue('url').trim();

    // Validasi platform
    const allowed = ['tiktok', 'instagram', 'x'];
    if (!allowed.includes(platform)) {
      return interaction.reply({
        content: `❌ Platform tidak valid. Gunakan salah satu: ${allowed.join(', ')}`,
        ephemeral: true
      });
    }

    // Validasi URL sederhana
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return interaction.reply({
        content: '❌ URL harus dimulai dengan http:// atau https://',
        ephemeral: true
      });
    }

    const added = socialManager.addUserSocial(userId, platform, url);
    if (!added) {
      return interaction.reply({
        content: '⚠️ Data sudah ada. Tidak ditambahkan ulang.',
        ephemeral: true
      });
    }

    return interaction.reply({
      content: `✅ Sukses menambahkan sosial media **${platform}**.`,
      ephemeral: true
    });
  }
}).toJSON();
