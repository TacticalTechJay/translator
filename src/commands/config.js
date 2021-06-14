import { Command } from "eris";
import { table } from 'table';
import languages from "../languages";

class Config extends Command {
    constructor() {
        super('config', 'null', {
            aliases: ['configuration', 'check'],
            description: 'Check your guild\'s setup.'
        })
        this.execute = async (message, args, prisma, guildCf) => {
            if (!guildCf) guildCf = await prisma.guild.create({ data: {id: message.guildID} })
            const tabel = table([
                ['GuildID', 'Channels', 'Languages', 'Prefix'],
                [guildCf.id, guildCf.channels.join('\n'), guildCf.languages.map(lang => languages[lang].name).join('\n'), `\`${guildCf.prefix}\``]
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
            return message.channel.createMessage(`\`\`\`\n${tabel}\`\`\``);
        }
    }
}