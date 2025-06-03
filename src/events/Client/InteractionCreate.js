const Event = require('../../structure/Event');

module.exports = new Event({
  event: 'interactionCreate',
  run: async (client, interaction) => {
    try {
      // Message commands
      if (interaction.isMessageContextMenuCommand()) {
        const command = client.collection.commands.application.get(interaction.commandName);
        if (command) await command.run(client, interaction);
        return;
      }

      // Slash commands
      if (interaction.isChatInputCommand()) {
        const command = client.collection.commands.slash.get(interaction.commandName);
        if (command) await command.run(client, interaction);
        return;
      }

      // Button interaction
      if (interaction.isButton()) {
        const id = interaction.customId;
        let component = client.collection.components.buttons.get(id);

        if (!component) {
          component = [...client.collection.components.buttons.values()].find(btn =>
            typeof btn.customId === 'string' && id.startsWith(btn.customId)
          );
        }

        if (component) await component.run(client, interaction);
        return;
      }

      // Select menu interaction
      if (interaction.isAnySelectMenu()) {
        const id = interaction.customId;
        let component = client.collection.components.selects.get(id);

        if (!component) {
          component = [...client.collection.components.selects.values()].find(sel =>
            typeof sel.customId === 'string' && id.startsWith(sel.customId)
          );
        }

        if (component) await component.run(client, interaction);
        return;
      }

      // Modal interaction
      if (interaction.isModalSubmit()) {
        const id = interaction.customId;
        let component = client.collection.components.modals.get(id);

        if (!component) {
          component = [...client.collection.components.modals.values()].find(mod =>
            typeof mod.customId === 'string' && id.startsWith(mod.customId)
          );
        }

        if (component) await component.run(client, interaction);
        return;
      }

      // Autocomplete interaction
      if (interaction.isAutocomplete()) {
        const command = client.collection.commands.slash.get(interaction.commandName);
        if (command && command.autocomplete) {
          await command.autocomplete(client, interaction);
        }
      }

    } catch (error) {
      console.error('[Interaction Error]', error);
    }
  }
}).toJSON();
