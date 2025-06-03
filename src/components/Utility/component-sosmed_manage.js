const { ComponentInteraction } = require('discord.js');
const DiscordBot = require('../../client/DiscordBot');
const Component = require('../../structure/Component');

/**
 * @param {DiscordBot} client
 * @param {ComponentInteraction} interaction
 */
module.exports = new Component({
    customId: 'sosmed_manage',

    run: async (client, interaction) => {
        await interaction.reply({
            ephemeral: true,
            components: [
                {
                    type: 1, // ActionRow
                    components: [
                        {
                            type: 3, // StringSelectMenu
                            custom_id: 'sosmed_select',
                            placeholder: 'Pilih platform sosial media',
                            options: [
                                {
                                    label: 'Instagram',
                                    value: 'instagram',
                                    emoji: '📸'
                                },
                                {
                                    label: 'TikTok',
                                    value: 'tiktok',
                                    emoji: '🎵'
                                },
                                {
                                    label: 'X (Twitter)',
                                    value: 'x',
                                    emoji: '🐦'
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
}).toJSON();
