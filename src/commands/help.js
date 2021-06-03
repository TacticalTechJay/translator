import { Command } from "eris";

class Help extends Command {
    constructor() {
        super('help', 'null', {
            aliases: ['cmds', 'h'],
            description: 'Display list of commands or get specific help',
            usage: '[Command]'
        })
        this.execute = (message, args, prisma, guildCf) => {
            if (!args[0]) {
                let res = '';
                message.channel.client.commands.forEach(e => res += `${guildCf?.prefix || process.env.PREFIX}${e.label} - ${e.description}\n`);
                return message.channel.createMessage(`Here are a list of commands:\n${res}`);
            } else if (args[0]) {
                x = message.channel.client.commands.get(args[0].toLowerCase())
                return x ? message.channel.createMessage(`${guildCf?.prefix || process.env.PREFIX}${x.label} - ${x.description}${x.aliases ? `\n${x.aliases.join(', ')}` : ''}\n\nUsage:${guildCf?.prefix || process.env.PREFIX}${x.label} ${x.usage}`) : message.channel.createMessage('That is not a valid command.')
            } else return message.channel.createMessage('How did you get here?');
        }
    }
}
export default Help;