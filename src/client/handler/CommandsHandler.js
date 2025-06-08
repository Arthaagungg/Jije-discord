const { REST, Routes } = require('discord.js');
const { info, error, success } = require('../../utils/Console');
const { readdirSync } = require('fs');
const DiscordBot = require('../DiscordBot');
const ApplicationCommand = require('../../structure/ApplicationCommand');
const MessageCommand = require('../../structure/MessageCommand');

class CommandsHandler {
    client;

    /**
     * @param {DiscordBot} client
     */
    constructor(client) {
        this.client = client;
    }

    load = () => {
        for (const directory of readdirSync('./src/commands/')) {
            for (const file of readdirSync('./src/commands/' + directory).filter(f => f.endsWith('.js'))) {
                try {
                    const module = require('../../commands/' + directory + '/' + file);
                    if (!module) continue;

                    if (module.__type__ === 2) {
                        if (!module.command || !module.run) {
                            error('Gagal memuat message command: ' + file);
                            continue;
                        }

                        this.client.collection.message_commands.set(module.command.name, module);

                        if (module.command.aliases && Array.isArray(module.command.aliases)) {
                            module.command.aliases.forEach(alias => {
                                this.client.collection.message_commands_aliases.set(alias, module.command.name);
                            });
                        }

                        info('Memuat message command: ' + file);
                    } else if (module.__type__ === 1) {
                        if (!module.command || !module.run) {
                            error('Gagal memuat application command: ' + file);
                            continue;
                        }

                        this.client.collection.application_commands.set(module.command.name, module);
                        this.client.rest_application_commands_array.push(module.command);

                        info('Memuat application command: ' + file);
                    } else {
                        error('Tipe command tidak valid (' + module.__type__ + ') dari file ' + file);
                    }
                } catch {
                    error('Gagal memuat command dari path: src/commands/' + directory + '/' + file);
                }
            }
        }

        success(`Berhasil memuat ${this.client.collection.application_commands.size} application command dan ${this.client.collection.message_commands.size} message command.`);
    }

    reload = () => {
        this.client.collection.message_commands.clear();
        this.client.collection.message_commands_aliases.clear();
        this.client.collection.application_commands.clear();
        this.client.rest_application_commands_array = [];

        this.load();
    }

    loadMinimal = () => {
        try {
            const addDeveloperCommand = require('../../commands/owner/addDeveloper.js');

            if (!addDeveloperCommand || !addDeveloperCommand.command || !addDeveloperCommand.run) {
                error('Gagal memuat command addDeveloper');
                return;
            }

            this.client.collection.message_commands.set(addDeveloperCommand.command.name, addDeveloperCommand);

            if (addDeveloperCommand.command.aliases && Array.isArray(addDeveloperCommand.command.aliases)) {
                addDeveloperCommand.command.aliases.forEach(alias => {
                    this.client.collection.message_commands_aliases.set(alias, addDeveloperCommand.command.name);
                });
            }

            success('✅ Command minimal berhasil dimuat: addDeveloper');
        } catch (err) {
            error('❌ Gagal memuat command minimal (addDeveloper)');
            console.error(err);
        }
    }

    /**
     * @param {{ enabled: boolean, guildId: string }} development
     * @param {Partial<import('discord.js').RESTOptions>} restOptions 
     */
    registerApplicationCommands = async (development, restOptions = null) => {
        const rest = new REST(restOptions ? restOptions : { version: '10' }).setToken(this.client.token);

        if (development.enabled) {
            await rest.put(Routes.applicationGuildCommands(this.client.user.id, development.guildId), {
                body: this.client.rest_application_commands_array
            });
        } else {
            await rest.put(Routes.applicationCommands(this.client.user.id), {
                body: this.client.rest_application_commands_array
            });
        }
    }
}

module.exports = CommandsHandler;
