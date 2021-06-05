import { Command } from "eris";

class Disable extends Command {
    constructor() {
        super('disable', 'null', {
            aliases: ['remove'],
            description: 'Unassigns a channel\'s language.',
            usage: '<TextChannel>'
        })
        this.execute = async (message, args, prisma, guildCf) => {
            if (!message.member.permissions.has("manageChannels")) return message.channel.createMessage('You need `MANAGE_CHANNELS` permission to use this command.');
            if (!message.channelMentions[0] || !args[0]) return message.channel.createMessage('No channel specified.');
            else if (!message.channel.guild.channels.has(message.channelMentions[0] || args[0])) return message.channel.createMessage('⚠️ Invalid channel! ⚠️');
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