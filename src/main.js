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
            },
            restMode: true
        });
        this.devs = process.env.DEVS.split(',')
        this.prisma = new PrismaClient();
        this._loadCommands();
    }

    async _loadCommands() {
        this.commands = new Map();
        const files = readdirSync('./src/commands', {encoding: 'utf8'});
        for (const file of files) {
            if (!file.endsWith('.js')) return;
            const Command = new (await import(`./commands/${file}`)).default()
            this.commands.set(Command.label, Command);
        }
        return true;
    }

    async translateText(text, targets) {
        if (!Array.isArray(targets)) throw new Errors('Targets must be an array.');
        const url = new URL(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0`)
        targets.forEach(target => url.searchParams.append('to', encodeURIComponent(target)));
        try{
            const results = (await fetch(url, 'POST').header('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY).body([{"text": text}]).send()).json();
            if (results.error) return results.error;
            return results[0];
        } catch(e) {
            return console.error(e);
        }
    }
}
export default TranslateClient;
