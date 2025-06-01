const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonInteraction
} = require("discord.js");

const Component = require("../../structure/Component");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new Component({
  customId: 'confess_reply',
  type: 'button',

  /**
   * @param {DiscordBot} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId(`confess_reply_modal-${interaction.message.id}`) // Simpan ID pesan ini
      .setTitle('Reply to Confession');

    const input = new TextInputBuilder()
      .setCustomId('reply_content')
      .setLabel('Tulis balasan kamu...')
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1000)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
}).toJSON();