const { ModalSubmitInteraction } = require("discord.js"); 
const DiscordBot = require("../../client/DiscordBot"); 
const Component = require("../../structure/Component");
const socialManager = require('../../utils/socials');

module.exports = new Component({ 
  customId: "sosmed_modal_add", 
  type: "modal",

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction 
   */
  run: async (client, interaction) => { 
    const platform = interaction.fields.getTextInputValue("platform")?.trim().toLowerCase();
    const username = interaction.fields.getTextInputValue("username")?.trim();

    const allowed = ["tiktok", "instagram", "x"];
    if (!allowed.includes(platform)) {
      return interaction.reply({
        content: "❌ Platform tidak valid. Gunakan salah satu dari: tiktok, instagram, x.",
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      await socialManager.addSocial(interaction.user.id, platform, username);

      await interaction.editReply({
        content: `✅ Berhasil menambahkan ${platform} dengan username \`${username}\`!`,
        ephemeral: true
      });
    } catch (err) {
      await interaction.editReply({
        content: `❌ Gagal menambahkan: ${err.message}`,
        ephemeral: true
      });
    }
  }
}).toJSON();
