const { Interaction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");

/**
 * 
 * @param {DiscordBot} client 
 * @param {Interaction} interaction 
 */
module.exports = async (client, interaction) => {
  try {
    // BUTTON
    if (interaction.isButton()) {
      const match = [...client.collection.components.buttons.keys()]
        .find((key) => key instanceof RegExp ? key.test(interaction.customId) : key === interaction.customId);

      const button = match && client.collection.components.buttons.get(match);
      if (button) {
        return button.run
          ? button.run(client, interaction)
          : button.execute(client, interaction);
      }
    }

    // SELECT MENU
    if (interaction.isSelectMenu()) {
      const select = client.collection.components.selects.get(interaction.customId);
      if (select) {
        return select.run
          ? select.run(client, interaction)
          : select.execute(client, interaction);
      }
    }

    // MODAL
    if (interaction.isModalSubmit()) {
      const modal = client.collection.components.modals.get(interaction.customId);
      if (modal) {
        return modal.run
          ? modal.run(client, interaction)
          : modal.execute(client, interaction);
      }
    }

    // AUTOCOMPLETE
    if (interaction.isAutocomplete()) {
      const autocomplete = client.collection.components.autocomplete.get(interaction.commandName);
      if (autocomplete) return autocomplete.run(client, interaction);
    }

    // SLASH COMMAND (opsional kalau kamu pakai)
    if (interaction.isChatInputCommand()) {
      const command = client.collection.slashCommands.get(interaction.commandName);
      if (command) return command.run(client, interaction);
    }

  } catch (err) {
    console.error("Interaction Error:", err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Terjadi kesalahan saat menjalankan interaksi.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Terjadi kesalahan saat menjalankan interaksi.', ephemeral: true });
    }
  }
};
