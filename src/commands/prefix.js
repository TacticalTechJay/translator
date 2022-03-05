import { Command } from "eris";

class Prefix extends Command {
    constructor() {
        super('prefix', 'null', {
            description: 'Change your guild\'s prefix for this bot.',
            usage: '[Prefix/`check`/ ]'
        })
        this.execute = async (message, args, prisma, guildCf) => {
            if (!message.member.permissions.has("manageChannels")) return message.channel.createMessage('You need `MANAGE_CHANNELS` permission to use this command.');
            if (!args[0]) {
                if (!guildCf || guildCf.prefix == (process.env.PREFIX || "!")) return message.channel.createMessage(`Prefix left unchanged. Currently \`${process.env.PREFIX || "!"}\``);
                await prisma.guild.update({
                    where: {
                        id: message.guildID
                    },
                    data: {
                        prefix: (process.env.PREFIX || "!")
                    }
                })
                return message.channel.createMessage(`Prefix has been reset. Now \`${process.env.PREFIX || "!"}\``);
            } else if (args[0].toLowerCase() == 'check') return message.channel.createMessage(`Prefix is currently \`${guildCf?.prefix || (process.env.PREFIX || "!")}\``);
            if (!guildCf) guildCf = await prisma.guild.create({ data: { id: message.guildID }});
            await prisma.guild.update({
                where: {
                    id: message.guildID
                },
                data: {
                    prefix: args[0]
                }
            })
            return message.channel.createMessage(`Prefix is now \`${args[0]}\``);    
        };
    }
}

export default Prefix;