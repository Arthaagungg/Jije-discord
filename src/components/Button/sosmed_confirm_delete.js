const Component = require("../../structure/Component");
const socialManager = require("../../utils/socials");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new Component({
  customId: /^sosmed_confirm_delete_\d+$/,
  type: "button",

  run: async (client, interaction) => {
    const socialId = interaction.customId.replace("sosmed_confirm_delete_", "");

    await socialManager.deleteSocialById(socialId); // ← pastikan method ini tersedia

    return interaction.update({
      content: "✅ Sosial media berhasil dihapus.",
      components: []
    });
  }
}).toJSON();
