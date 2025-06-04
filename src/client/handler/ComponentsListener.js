const DiscordBot = require("../DiscordBot");
const config = require("../../config");
const { error } = require("../../utils/Console");

class ComponentsListener {
    /**
     * 
     * @param {DiscordBot} client 
     */
    constructor(client) {
        client.on('interactionCreate', async (interaction) => {
            const checkUserPermissions = async (component) => {
                if (component.options?.public === false && interaction.user.id !== interaction.message?.interaction?.user?.id) {
                    await interaction.reply({
                        content: config.messages.COMPONENT_NOT_PUBLIC,
                        ephemeral: true
                    });

                    return false;
                }

                return true;
            };

            try {
                // Handle Button (✨ Sudah support Regex)
                if (interaction.isButton()) {
                    const components = [...client.collection.components.buttons.values()];
                    const component = components.find(c => {
                        if (typeof c.customId === 'string') return c.customId === interaction.customId;
                        if (c.customId instanceof RegExp) return c.customId.test(interaction.customId);
                        return false;
                    });

                    if (!component) return;

                    if (!(await checkUserPermissions(component))) return;

                    try {
                        await component.run(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                // Handle Select Menu (✨ Sudah support Regex)
                if (interaction.isAnySelectMenu()) {
                    const components = [...client.collection.components.selects.values()];
                    const component = components.find(c => {
                        if (typeof c.customId === 'string') return c.customId === interaction.customId;
                        if (c.customId instanceof RegExp) return c.customId.test(interaction.customId);
                        return false;
                    });

                    if (!component) return;

                    if (!(await checkUserPermissions(component))) return;

                    try {
                        await component.run(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                // Handle Modal Submit (✨ Sudah support Regex)
                if (interaction.isModalSubmit()) {
                    const components = [...client.collection.components.modals.values()];
                    const component = components.find(c => {
                        if (typeof c.customId === 'string') return c.customId === interaction.customId;
                        if (c.customId instanceof RegExp) return c.customId.test(interaction.customId);
                        return false;
                    });

                    if (!component) return;

                    try {
                        await component.run(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                // Handle Autocomplete
                if (interaction.isAutocomplete()) {
                    const component = client.collection.components.autocomplete.get(interaction.commandName);
                    if (!component) return;

                    try {
                        await component.run(client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

            } catch (err) {
                error(err);
            }
        });
    }
}

module.exports = ComponentsListener;
