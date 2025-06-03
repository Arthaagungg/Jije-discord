const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
    customId: "sosmed_action_menu:\\d+",
    type: 'select',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
    const value = interaction.values[0];
    await interaction.reply({
      content: `✅ Kamu memilih: ${value}`,
      ephemeral: true,
    });
  }
}).toJSON();
