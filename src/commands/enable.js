import { Command } from 'eris';
const langKeys = Object.keys(languages);

class Enable extends Command {
    constructor() {
        super('enable', 'null', {
            aliases: ['add'],
            description: 'Assign a language to a channel.',
            usage: '<TextChannel>'
        });
        this.execute = async (message, args, prisma, guildCf) => {
            if (!message.member.permissions.has("manageChannels")) return message.channel.createMessage('You need `MANAGE_CHANNELS` permission to use this command.');
            if (!args[0]) return message.channel.createMessage('The correct usage would be: `!enable <#Channel>`');
            else if (args.length > 1) return message.channel.createMessage('Too many arguments provided.');
            else if (!message.channel.guild.channels.has(message.channelMentions[0] || args[0])) return message.channel.createMessage('⚠️ Invalid channel! ⚠️');
            if (!guildCf) guildCf = await prisma.guild.create({data: { id: message.guildID }});
            if (guildCf.channels.filter(a => a.id === (message.channelMentions[0] || args[0]))[0]) return message.channel.createMessage('This channel is already assigned a language.');
            try {
                guildCf.channels.push(message.channelMentions[0] || args[0])
                await prisma.guild.update({
                    where: { id: message.guildID },
                    data: guildCf
                });
                return await message.channel.createMessage(`I will now translate messages in <#${message.channelMentions[0] || args[0]}>`);
            } catch (e) {
                console.error(e);
                return message.channel.createMessage('Something went wrong!')
            }    
        };
    }
}

export default Enable;