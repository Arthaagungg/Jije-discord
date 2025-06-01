const {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");
const Component = require("../../structure/Component");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new Component({
  customId: 'intro_button',
  type: 'button',

  /**
   * @param {DiscordBot} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setCustomId('intro_modal')
      .setTitle('Introduce Yourself');

    const nameInput = new TextInputBuilder()
      .setCustomId('intro_name')
      .setLabel('Name')
      .setPlaceholder('Enter your name')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const ageInput = new TextInputBuilder()
      .setCustomId('intro_age')
      .setLabel('Age')
      .setPlaceholder('Enter your age (0–99)')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const genderInput = new TextInputBuilder()
      .setCustomId('intro_gender')
      .setLabel('Gender')
      .setPlaceholder('Male or Female')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const regionInput = new TextInputBuilder()
      .setCustomId('intro_region')
      .setLabel('Region')
      .setPlaceholder('Where do you live?')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

    const aboutInput = new TextInputBuilder()
      .setCustomId('intro_about')
      .setLabel('About You')
      .setPlaceholder('Tell us something about you!')
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
      new ActionRowBuilder().addComponents(nameInput),
      new ActionRowBuilder().addComponents(ageInput),
      new ActionRowBuilder().addComponents(genderInput),
      new ActionRowBuilder().addComponents(regionInput),
      new ActionRowBuilder().addComponents(aboutInput)
    );

    await interaction.showModal(modal);
  }
}).toJSON();