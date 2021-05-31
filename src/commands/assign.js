import { Command } from 'eris';
import languages from '../languages.js';
const langKeys = Object.keys(languages);

class Assign extends Command {
    constructor() {
        super('assign', 'null', {
            aliases: ['set'],
            description: 'Assign a language to a channel.'
        });
        this.execute = this.exec;
    }

    async exec(message, args, prisma) {
        if (!message.member.permissions.has("manageChannels")) return message.channel.createMessage('You need `MANAGE_CHANNELS` permission to use this command.');
        if (!args[0] || !args[1]) return message.channel.createMessage('The correct usage would be: `!assign #Channel <lang>`');
        if (args.length > 2) return message.channel.createMessage('Too many arguments provided.');
        const op = langKeys.filter(a => a === args[1].toLowerCase())[0] || langKeys.filter(lang => languages[lang].name.toLowerCase() === args[1].toLowerCase())[0]
        if (!op) return message.channel.createMessage('That\'s... not a supported language.');
        let guild = await prisma.guild.findUnique({ where: { id: message.guildID }});
        if (!guild) guild = await prisma.guild.create({data: { id: message.guildID }});
        if (guild.channels.filter(a => a.id === message.channelMentions[0])[0]) return message.channel.createMessage('This channel is already assigned a language.');
        if (guild.channels.filter(a => a.lang === op)[0]) return message.channel.createMessage(`A channel already has that language. <#${guild.channels.filter(a => a.lang ===op)[0].id}>`);
        try {
            guild.channels.push({
                id: message.channelMentions[0],
                lang: op
            });
            await prisma.guild.update({
                where: {
                    id: message.guildID
                },
                data: {
                    channels: {
                        set: guild.channels
                    }
                }
            });
            return await message.channel.createMessage(`Assigned <#${message.channelMentions[0]}> the following language: ${languages[op].name}`);
        } catch (e) {
            console.error(e);
            return message.channel.createMessage('Something went wrong!')
        }
    }
}

export default Assign;