const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  customId: "tambah-sosmed",
  type: "button",
  run: async (interaction) => {
    const modal = new ModalBuilder()
      .setCustomId("add-sosmed")
      .setTitle("Tambah Sosial Media");

    const platformInput = new TextInputBuilder()
      .setCustomId("platform")
      .setLabel("Platform (tiktok / instagram / x)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const usernameInput = new TextInputBuilder()
      .setCustomId("username")
      .setLabel("Username")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstRow = new ActionRowBuilder().addComponents(platformInput);
    const secondRow = new ActionRowBuilder().addComponents(usernameInput);

    modal.addComponents(firstRow, secondRow);

    await interaction.showModal(modal);
  },
};
