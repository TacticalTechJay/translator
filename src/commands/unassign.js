import { Command } from "eris";

class Unassign extends Command {
    constructor() {
        super('unassign', 'null', {
            aliases: ['unset', 'clear'],
            description: 'Unassigns a channel\'s language.'
        })
        this.execute = this.exec;
    }
    async exec(message, args, prisma) {
        if (!message.member.permissions.has("manageChannels")) return message.channel.createMessage('You need `MANAGE_CHANNELS` permission to use this command.');
        if (!message.channelMentions[0] || !args[0]) return message.channel.createMessage('No channel specified.');
        if (args.length > 1) return message.channel.createMessage('Too many arguments provided');
        const guildCf = await prisma.guild.findUnique({ where: { id: message.guildID }});
        if (!guildCf || !guildCf?.channels[0]) return message.channel.createMessage('No channels assigned.');
        const oldChannels = new Array(guildCf.channels);
        console.log(oldChannels);
        guildCf.channels = guildCf.channels.filter(channel => channel.id !== message.channelMentions[0]);
        try {
            await prisma.guild.update({
                where: {
                    id: message.guildID
                },
                data: {
                    channels: {
                        set: guildCf.channels
                    }
                }
            });
            return await message.channel.createMessage(`Unassigned <#${message.channelMentions[0]}>.`);
        } catch (e) {
            console.error(e);
            return message.channel.createMessage('Something went wrong! Try again later.');
        }
    }
}
export default Unassign;