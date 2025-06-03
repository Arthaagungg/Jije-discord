const { StringSelectMenuInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: /^sosmed_action_menu:/,
  type: "selectMenu",

  /**
   * @param {DiscordBot} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const [_, targetUserId] = interaction.customId.split(":");

    if (interaction.user.id !== targetUserId) {
      return interaction.reply({
        content: "❌ Ini bukan menu milik kamu.",
        ephemeral: true,
      });
    }

    const value = interaction.values[0];

    // Respon sederhana sesuai pilihan
    if (value === "add") {
      return interaction.reply({
        content: "📥 Ini menu **add**.",
        ephemeral: true,
      });
    } else if (value === "edit") {
      return interaction.reply({
        content: "📝 Ini menu **edit**.",
        ephemeral: true,
      });
    } else if (value === "delete") {
      return interaction.reply({
        content: "🗑️ Ini menu **delete**.",
        ephemeral: true,
      });
    }
  },
}).toJSON();
