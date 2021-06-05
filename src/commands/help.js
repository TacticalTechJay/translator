import { Command } from "eris";

class Help extends Command {
    constructor() {
        super('help', 'null', {
            aliases: ['cmds', 'h'],
            description: 'Display list of commands or get specific help',
            usage: '[Command]'
        })
        this.execute = async (message, args, prisma, guildCf) => {
            if (!guildCf) guildCf = await prisma.guild.create({ data: { id: message.guildID }});
            if (!args[0]) {
                let res = '';
                if (!guildCf.firstRun) {
                    res += 'Hello from the USA! I am a Translator bot used to unify channels of different languages. My commands may be small on the front, but I am working hard behind the scenes to get your messages translated in the right language!'
                    guildCf.firstRun = !guildCf.firstRun
                    await prisma.guild.update({
                        where: { id: message.guildID },
                        data: guildCf
                    })
                }
                else res += 'Here are the commands that I have:\n';
                message.channel.client.commands.forEach(e => {
                    if (e.label !== 'eval' ) res += `${guildCf?.prefix || process.env.PREFIX}${e.label} - ${e.description}\n`
                });
                return message.channel.createMessage(res);
            } else if (args[0]) {
                const x = message.channel.client.commands.get(args[0].toLowerCase())
                return x ? message.channel.createMessage(`${guildCf?.prefix || process.env.PREFIX}${x.label} - ${x.description}${x.aliases ? `\nAliases: ${x.aliases.join(', ')}` : ''}\n\nUsage: ${guildCf?.prefix || process.env.PREFIX}${x.label} ${x.usage}`) : message.channel.createMessage('That is not a valid command.')
            } else return message.channel.createMessage('How did you get here?');
        }
    }
}
export default Help;