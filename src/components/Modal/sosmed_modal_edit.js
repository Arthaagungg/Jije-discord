const { ModalSubmitInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const socialManager = require('../../utils/socials');

module.exports = new Component({
  customId: /^sosmed_modal_edit\d+$/, // support regex ID unik
  type: "modal",

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const socials = await socialManager.getUserSocials(userId);

    let updatedCount = 0;

    for (const social of socials) {
      const fieldId = `edit_${social.id}`;

      // 💡 Pastikan field ini ada di modal yang dikirim user
      if (interaction.fields.fields.has(fieldId)) {
        const newValue = interaction.fields.getTextInputValue(fieldId).trim();

        if (newValue && newValue !== social.username) {
          await socialManager.updateUserSocial(userId, social.id, newValue);
          updatedCount++;
        }
      }
    }

    if (updatedCount === 0) {
      return interaction.reply({
        content: "⚠️ Tidak ada perubahan yang disimpan.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `✅ ${updatedCount} sosial media berhasil diperbarui.`,
      ephemeral: true,
    });
  },
});
