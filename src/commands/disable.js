import { Command } from "eris";

class Disable extends Command {
    constructor() {
        super('disable', 'null', {
            aliases: ['disallow', 'unallow'],
            description: 'Disallows a channel to have messages translated.',
            usage: '<TextChannel>'
        })
        this.execute = async (message, args, prisma, guildCf) => {
            if (!message.member.permissions.has("manageChannels")) return message.channel.createMessage('You need `MANAGE_CHANNELS` permission to use this command.');
            console.log(message.channelMentions[0] ? message.channelMentions[0] : '...yikes')
            console.log(args[0] ? args[0] : '...double yikes');
            if ((!args[0] || !message.channelMentions[0])) return message.channel.createMessage('No channel specified.');
            else if (!message.channel.guild.channels.has(message.channelMentions[0] || args[0])) {
                console.log('Hello! You made it here!\n' + guildCf.channels.includes);
                if (guildCf.channels.includes(message.channelMentions[0] || args[0])) {
                    guildCf.channels = guildCf.channels.filter(channel => channel !== (message.channelMentions[0] || args[0]))
                    await prisma.guild.update({
                        where: { id: message.guildID },
                        data: guildCf
                    })
                    return message.channel.send('I have done a hard remove of that channel due to it either no longer existing or I am unable to read messages within that channel.')
                } else return message.channel.createMessage('⚠️ Invalid channel! ⚠️');
            }
            else if (args.length > 1) return message.channel.createMessage('Too many arguments provided');
            if (!guildCf || !guildCf?.channels[0]) return message.channel.createMessage('No channels assigned.');
            try {
                guildCf.channels = guildCf.channels.filter(channel => channel !== (message.channelMentions[0] || args[0]));
                await prisma.guild.update({
                    where: { id: message.guildID },
                    data: guildCf
                });
                return await message.channel.createMessage(`I will no longer translate messages in <#${message.channelMentions[0]}>`);
            } catch (e) {
                console.error(e);
                return message.channel.createMessage('Something went wrong! Try again later.');
            }    
        };
    }
}
export default Disable;