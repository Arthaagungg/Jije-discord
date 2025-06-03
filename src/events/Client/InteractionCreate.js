const { Events } = require("discord.js");

/**
 * Fungsi bantu untuk mencari komponen berdasarkan customId (support string & RegExp)
 * @param {Map} collection 
 * @param {string} customId 
 */
function findComponent(collection, customId) {
  for (const comp of collection.values()) {
    if (
      typeof comp.customId === "string" && comp.customId === customId ||
      comp.customId instanceof RegExp && comp.customId.test(customId)
    ) {
      return comp;
    }
  }
  return null;
}

module.exports = {
  name: Events.InteractionCreate,

  /**
   * 
   * @param {import("../../client/DiscordBot")} client 
   * @param {import("discord.js").Interaction} interaction 
   */
  run: async (client, interaction) => {
    try {
      // Slash Command
      if (interaction.isChatInputCommand()) {
        const command = client.collection.commands.get(interaction.commandName);
        if (!command) return;
        await command.run(client, interaction);
      }

      // Context Menu
      else if (interaction.isContextMenuCommand()) {
        const command = client.collection.commands.get(interaction.commandName);
        if (!command) return;
        await command.run(client, interaction);
      }

      // Autocomplete
      else if (interaction.isAutocomplete()) {
        const component = client.collection.components.autocomplete.get(interaction.commandName);
        if (!component) return;
        await component.run(client, interaction);
      }

      // Button
      else if (interaction.isButton()) {
        const component = findComponent(client.collection.components.buttons, interaction.customId);
        if (!component) return;
        await component.run(client, interaction);
      }

      // Select Menu (Any)
      else if (interaction.isAnySelectMenu()) {
        const component = findComponent(client.collection.components.selects, interaction.customId);
        if (!component) return;
        await component.run(client, interaction);
      }

      // Modal Submit
      else if (interaction.isModalSubmit()) {
        const component = findComponent(client.collection.components.modals, interaction.customId);
        if (!component) return;
        await component.run(client, interaction);
      }

    } catch (err) {
      console.error("[Interaction Error]", err);
    }
  }
};
