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
    const socials = await socialManager.getUserSocials(interaction.user.id);

    if (!socials || socials.length === 0) {
      return interaction.reply({
        content: "❌ Tidak ada sosial media yang bisa diedit.",
        ephemeral: true
      });
    }

    let updated = 0;

    for (let i = 0; i < socials.length; i++) {
      const social = socials[i];
      const fieldId = `edit_${social.platform}_${social.username}`;
      const newUsername = interaction.fields.getTextInputValue(fieldId)?.trim();

      if (newUsername && newUsername !== social.username) {
        await socialManager.editSocial(interaction.user.id, social.platform, social.username, newUsername);
        updated++;
      }
    }

    if (updated === 0) {
      return interaction.reply({
        content: "⚠️ Tidak ada perubahan yang dilakukan.",
        ephemeral: true
      });
    }

    return interaction.reply({
      content: `✅ Berhasil mengedit ${updated} sosial media!`,
      ephemeral: true
    });
  }
}).toJSON();
