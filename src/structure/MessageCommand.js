const DiscordBot = require('../client/DiscordBot');

class MessageCommand {
    /**
     *
     * @param {{
     *   command: {
     *     name: string,
     *     description?: string,
     *     aliases?: string[],
     *     permissions?: import('discord.js').PermissionResolvable[]
     *   },
     *   options?: Partial<{
     *     cooldown: number,
     *     botOwner: boolean,
     *     guildOwner: boolean,
     *     botDevelopers: boolean,
     *     nsfw: boolean
     *   }>,
     *   run: import("discord.js").Awaitable<(
     *     client: DiscordBot,
     *     message: import('discord.js').Message,
     *     args: string[]
     *   ) => void>
     * }} structure
     */
    constructor(structure) {
        this.command = {
            name: structure.command.name,
            description: structure.command.description || '',
            aliases: structure.command.aliases || [],
            permissions: structure.command.permissions || []
        };

        this.options = structure.options || {};
        this.run = structure.run;
        this.__type__ = 2; // Internal marker for handler
    }

    toJSON = () => {
        return {
            command: this.command,
            options: this.options,
            run: this.run,
            __type__: this.__type__
        };
    }
}

module.exports = MessageCommand;