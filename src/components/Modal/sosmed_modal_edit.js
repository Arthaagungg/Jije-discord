const { ModalSubmitInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const socialManager = require('../../utils/socials');

module.exports = new Component({
  customId: "sosmed_modal_edit",
  type: "modal",

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const socials = await socialManager.getUserSocials(interaction.user.id);

      // Cek apakah pengguna punya sosial media
      if (!socials || socials.length === 0) {
        return interaction.reply({
          content: "❌ Tidak ada sosial media yang bisa diedit.",
          ephemeral: true,
        });
      }

      let updated = 0;

      for (let i = 0; i < socials.length; i++) {
        const social = socials[i];
        const fieldId = `edit_${social.id}`;

        // Cek apakah field ada dalam modal input
        if (!interaction.fields.fields.has(fieldId)) continue;

        const newUsername = interaction.fields.getTextInputValue(fieldId)?.trim();

        if (newUsername && newUsername !== social.username) {
          await socialManager.editSocialById(social.id, social.platform, newUsername);
          updated++;
        }
      }

      return interaction.reply({
        content: updated > 0
          ? `✅ Berhasil mengedit ${updated} sosial media!`
          : "⚠️ Tidak ada perubahan yang dilakukan.",
        ephemeral: true,
      });

    } catch (error) {
      console.error("❌ Error saat memproses edit sosial media:", error);
      return interaction.reply({
        content: "❌ Terjadi kesalahan saat mengedit sosial media.",
        ephemeral: true,
      });
    }
  }
}).toJSON();
