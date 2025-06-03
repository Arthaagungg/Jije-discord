const { ModalSubmitInteraction } = require("discord.js");
const { addSocial, allowedPlatforms } = require("../../utils/socialManager");

module.exports = {
  customId: "add-sosmed",
  type: "modal",
  /**
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (interaction) => {
    const platform = interaction.fields.getTextInputValue("platform")?.toLowerCase();
    const username = interaction.fields.getTextInputValue("username");

    if (!allowedPlatforms.includes(platform)) {
      return await interaction.reply({
        content: `❌ Platform tidak valid. Pilih dari: ${allowedPlatforms.join(", ")}`,
        ephemeral: true,
      });
    }

    if (!username) {
      return await interaction.reply({
        content: `❌ Username tidak boleh kosong.`,
        ephemeral: true,
      });
    }

    let url;
    switch (platform) {
      case "tiktok":
        url = `https://tiktok.com/@${username}`;
        break;
      case "instagram":
        url = `https://instagram.com/${username}`;
        break;
      case "x":
        url = `https://x.com/${username}`;
        break;
    }

    addSocial(interaction.user.id, platform, url);

    await interaction.reply({
      content: `✅ Berhasil menambahkan sosial media **${platform}**: [${username}](${url})`,
      ephemeral: true,
    });
  },
};
