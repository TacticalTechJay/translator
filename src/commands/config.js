import { Command } from "eris";
import { table } from 'table';

class Config extends Command {
    constructor() {
        super('config', 'null', {
            aliases: ['configuration', 'check'],
            description: 'Check your guild\'s setup.'
        })
        this.execute = async (message, args, prisma, guildCf) => {
            if (!guildCf) guildCf = await prisma.guild.create({ data: {id: message.guildID} })
            const x = table([
                ['GuildID', 'Channels', 'Languages', 'Prefix'],
                [guildCf.id, `${guildCf.channels?.map(x => x.id)}`, `${guildCf.channels?.map(x => languages[x.lang].name).join('\n') || 'None.'}`, `${guildCf.prefix || process.env.PREFIX}`]
            ], {
                border: {
                    topBody: `─`,
                    topJoin: `┬`,
                    topLeft: `┌`,
                    topRight: `┐`,
                
                    bottomBody: `─`,
                    bottomJoin: `┴`,
                    bottomLeft: `└`,
                    bottomRight: `┘`,
                
                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,
                
                    joinBody: `─`,
                    joinLeft: `├`,
                    joinRight: `┤`,
                    joinJoin: `┼`
                }
            });
            return message.channel.createMessage(`\`\`\`\n${x}\`\`\``);
        }
    }
}
export default Config