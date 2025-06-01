const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: 'confess_write',
  type: 'button',

  /**
   * @param {DiscordBot} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId('confess_write_modal')
      .setTitle('Anonymous Confession');

    const input = new TextInputBuilder()
      .setCustomId('confess_content')
      .setLabel('Tulis confession kamu...')
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1000)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
}).toJSON();