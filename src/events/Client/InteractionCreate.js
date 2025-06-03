const Event = require('../../structure/Event');

module.exports = new Event({
  event: 'interactionCreate',
  run: async (client, interaction) => {
    try {
      if (interaction.isButton()) {
        const id = interaction.customId;

        let component = client.collection.components.buttons.get(id);

        if (!component) {
          component = [...client.collection.components.buttons.values()].find(btn =>
            id.startsWith(btn.customId)
          );
        }

        if (component) {
          await component.run(client, interaction);
        } else {
          await interaction.reply({
            content: 'Tombol tidak dikenali.',
            ephemeral: true
          });
        }
      }

      else if (interaction.isStringSelectMenu()) {
        const id = interaction.customId;

        let component = client.collection.components.selects.get(id);

        if (!component) {
          component = [...client.collection.components.selects.values()].find(sel =>
            id.startsWith(sel.customId)
          );
        }

        if (component) {
          await component.run(client, interaction);
        } else {
          await interaction.reply({
            content: 'Select menu tidak dikenali.',
            ephemeral: true
          });
        }
      }

      else if (interaction.isModalSubmit()) {
        const id = interaction.customId;

        let component = client.collection.components.modals.get(id);

        if (!component) {
          component = [...client.collection.components.modals.values()].find(mod =>
            id.startsWith(mod.customId)
          );
        }

        if (component) {
          await component.run(client, interaction);
        } else {
          await interaction.reply({
            content: 'Modal tidak dikenali.',
            ephemeral: true
          });
        }
      }

      else if (interaction.isAutocomplete()) {
        const commandName = interaction.commandName;
        const component = client.collection.components.autocomplete.get(commandName);

        if (component) {
          await component.run(client, interaction);
        }
      }
    } catch (err) {
      console.error('Error in interactionCreate:', err);
    }
  }
}).toJSON();
