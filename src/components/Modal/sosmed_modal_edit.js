const socialManager = require('../../utils/socials');

module.exports = new Component({
  customId: "sosmed_modal_edit",
  type: "modal",

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    const socials = await socialManager.getUserSocials(interaction.user.id);

    // Cek apakah pengguna memiliki data sosial media
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
  }
}).toJSON();
