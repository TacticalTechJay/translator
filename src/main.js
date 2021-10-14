import { Client } from 'eris';
import fetch from 'petitio';
import { readdirSync } from 'fs'
import Prisma from '@prisma/client'
const { PrismaClient } = Prisma;

class TranslateClient extends Client {
    constructor(token) {
        super(token, {
            allowedMentions: {
                everyone: false,
                roles: false,
                users: false,
                repliedUser: false
            }
        });
        this.prisma = new PrismaClient();
        this._loadCommands();
    }

    async _loadCommands() {
        this.commands = new Map();
        const files = readdirSync('./src/commands', {encoding: 'utf8'});
        for (const file of files) {
            if (!file.endsWith('.js')) return;
            const Command = new (await import(`./commands/${file}`)).default();
            this.commands.set(Command.label, Command);
        }
        return true;
    }

    async translateText(text, targets, from) {
        if (!Array.isArray(targets)) throw new Errors('Targets must be an array.');
        const results = { "translations": [] };
        results.detectedLanguage = (await fetch(`https://xpirymints.cf/detect?q=${encodeURIComponent(text)}`, 'POST').send()).json()[0].language;
        for (const target of targets) {
            const url = new URL(`https://xpirymints.cf/translate?q=${encodeURIComponent(text)}&source=${from}&target=${target}`);
            const result = (await fetch(url, 'POST').send()).json();
            results.translations.push({ "text": result.translatedText, "to": target });
        }
        return results;
    }
}
export default TranslateClient;