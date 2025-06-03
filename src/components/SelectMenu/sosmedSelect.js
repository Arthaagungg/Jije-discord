const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  customId: "select-sosmed",
  type: "selectMenu",
  run: async (interaction) => {
    const [platform, url] = interaction.values[0].split("|");

    const modal = new ModalBuilder()
      .setCustomId(`edit-sosmed-${platform}|${url}`)
      .setTitle("Edit atau Hapus Sosmed");

    const urlInput = new TextInputBuilder()
      .setCustomId("newUrl")
      .setLabel("Link baru (biarkan kosong untuk hapus)")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("https://...")
      .setRequired(false);

    const firstRow = new ActionRowBuilder().addComponents(urlInput);
    modal.addComponents(firstRow);

    await interaction.showModal(modal);
  },
};
