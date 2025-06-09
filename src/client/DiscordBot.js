const { Client, Collection, Partials } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, success } = require("../utils/Console");
const config = require("../config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const { QuickYAML } = require("quick-yaml.db");
const supabase = require("../utils/supabase");

class DiscordBot extends Client {
    collection = {
        application_commands: new Collection(),
        message_commands: new Collection(),
        message_commands_aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        }
    };

    rest_application_commands_array = [];
    login_attempts = 0;
    login_timestamp = 0;

    commands_handler = new CommandsHandler(this);
    components_handler = new ComponentsHandler(this);
    events_handler = new EventsHandler(this);
    database = new QuickYAML(config.database.path);

    constructor(botConfig) {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],
            presence: {
                activities: botConfig.status?.length ? [botConfig.status[0]] : [],
                status: 'online'
            }
        });

        this.token = botConfig.token;
        this.statusMessages = botConfig.status || [];

        new CommandsListener(this);
        new ComponentsListener(this);
    }

    async checkDevelopers() {
        const { data, error } = await supabase.from('developers').select('*');
        if (error) {
            console.error('❌ Supabase error saat cek developers:', error);
            return false;
        }
        return data.length > 0;
    }

    startStatusRotation = () => {
        if (!this.statusMessages.length) return;

        let index = 0;
        setInterval(() => {
            this.user.setPresence({ activities: [this.statusMessages[index]] });
            index = (index + 1) % this.statusMessages.length;
        }, 4000);
    };

    connect = async () => {
        warn(`🔌 Mencoba menyambung ke bot Discord... (percobaan ${this.login_attempts + 1})`);

        this.login_timestamp = Date.now();

        try {
            await this.login(this.token);

            const hasDevelopers = await this.checkDevelopers();
            if (!hasDevelopers) {
                warn('🚫 Tidak ada developer terdaftar. Memuat perintah terbatas khusus owner...');
                this.commands_handler.loadMinimal();
                return;
            }

            this.commands_handler.load();
            this.components_handler.load();
            this.events_handler.load();
            this.startStatusRotation();

            warn('📦 Registering application commands...');
            await this.commands_handler.registerApplicationCommands(config.development);
            success('✅ Application commands berhasil diregistrasi. Mode guild? ' + (config.development.enabled ? 'Ya' : 'Tidak'));
        } catch (err) {
            error('❌ Gagal menyambung ke bot Discord. Mencoba ulang...');
            error(err);
            this.login_attempts++;
            setTimeout(this.connect, 5000);
        }
    };
}

module.exports = DiscordBot;
