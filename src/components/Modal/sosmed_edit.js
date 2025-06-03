const { ModalSubmitInteraction } = require("discord.js");
const { editSocial, removeSocial } = require("../../utils/socialManager");

module.exports = {
  customId: /^edit-sosmed-(.+)\|(.+)$/, // Gunakan regex agar dynamic
  type: "modal",
  /**
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (interaction) => {
    const match = interaction.customId.match(/^edit-sosmed-(.+)\|(.+)$/);
    if (!match) return;

    const [, platform, oldUrl] = match;
    const newUrl = interaction.fields.getTextInputValue("newUrl");

    let success = false;
    if (newUrl.trim()) {
      success = editSocial(interaction.user.id, platform, oldUrl, newUrl.trim());
    } else {
      success = removeSocial(interaction.user.id, platform, oldUrl);
    }

    if (success) {
      await interaction.reply({
        content: newUrl.trim()
          ? `✅ Sosial media **${platform}** berhasil diubah.`
          : `✅ Sosial media **${platform}** berhasil dihapus.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `❌ Gagal memproses sosial media.`,
        ephemeral: true,
      });
    }
  },
};
