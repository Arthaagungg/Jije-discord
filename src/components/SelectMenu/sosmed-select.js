const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle
} = require('discord.js');
const socialManager = require('../../utils/socialManager');

const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: 'sosmed_select',
  type: 'select',
  /**
   * 
   * @param {DiscordBot} client 
   * @param {import("discord.js").AnySelectMenuInteraction} interaction 
   */
  run: async (client, interaction) => {
    const action = interaction.values[0]; // 'add', 'edit', 'remove'
    const userId = interaction.user.id;

    if (action === 'add') {
      const modal = new ModalBuilder()
        .setCustomId('sosmed_modal_add')
        .setTitle('➕ Tambah Sosial Media')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('platform')
              .setLabel('Platform (tiktok / instagram / x)')
              .setPlaceholder('Misal: instagram')
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('url')
              .setLabel('Link Sosial Media')
              .setPlaceholder('https://...')
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
          )
        );
      return interaction.showModal(modal);
    }

    const userSocials = socialManager.getUserSocials(userId);
    if (userSocials.length === 0) {
      return interaction.reply({
        content: '❌ Kamu belum punya sosial media untuk dikelola.',
        ephemeral: true
      });
    }

    if (action === 'edit') {
      const modal = new ModalBuilder()
        .setCustomId('sosmed_modal_edit')
        .setTitle('✏️ Edit Sosial Media')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('target')
              .setLabel('Pilih (platform::url)')
              .setPlaceholder('contoh: instagram::https://...')
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('newurl')
              .setLabel('Ganti dengan link baru')
              .setPlaceholder('https://...')
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
          )
        );
      return interaction.showModal(modal);
    }

    if (action === 'remove') {
      const modal = new ModalBuilder()
        .setCustomId('sosmed_modal_remove')
        .setTitle('🗑️ Hapus Sosial Media')
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('target')
              .setLabel('Pilih (platform::url)')
              .setPlaceholder('contoh: instagram::https://...')
              .setRequired(true)
              .setStyle(TextInputStyle.Short)
          )
        );
      return interaction.showModal(modal);
    }
  }
}).toJSON();
