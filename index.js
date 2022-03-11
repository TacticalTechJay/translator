import TranslateClient from './src/main.js'
import 'dotenv/config'

if (!process.env.TLURL && !process.env.PORT) throw 'ERR: No URL or PORT provided.'

const bot = new TranslateClient(process.env.DISCORD_TOKEN);

bot.on('messageCreate', async msg => {
    if (msg.author.bot || !msg.guildID) return;
    const guildCf = await bot.prisma.guild.findUnique({ where: { id: msg.guildID }});
    if (msg.content === `<@!${bot.user.id}>`) return msg.channel.createMessage(`Prefix is \`${guildCf?.prefix || (process.env.PREFIX || '!')}\``);
    if (!msg.content.startsWith(guildCf?.prefix || (process.env.PREFIX || '!'))) {
        if (msg.content.length > 950) return;
        if (!guildCf || !guildCf?.channels[0]) return;
        const channels = guildCf.channels.filter(c => msg.channel.id !== c.id);
        if (channels.toString() == guildCf.channels.toString()) return;
        const targets = channels.map(channel => channel.lang);
        const from = guildCf.channels.filter(c => msg.channel.id == c.id)[0]
        try {
            if (!targets[0]) return;
            const { translations } = await bot.translateText(msg.content, targets, from.lang);
            return translations.forEach(async t => {
                const channel = bot.getChannel(guildCf.channels.find(channel => channel.lang == t.to)?.id)
                if (!channel) {
                    guildCf.channels = guildCf.channels.filter(x => x.lang !== t.to);
                    return await bot.prisma.guild.update({
                        where: { id: msg.guildID },
                        data: guildCf
                    })
                }
                return channel.createMessage(`> ${msg.content} - ${msg.author.username} : <#${from.id}> ${from.lang}\n${t.text}`);
            });
        } catch (e) {
            return console.error(e);
        }
    };
    const args = msg.content.replace(/<@!/g, "<@").substring(guildCf?.prefix?.length || (process.env.PREFIX || "!").length).trim().split(/\s+/g);
    const x = args.shift();
    let Command = bot.commands.get(x);
    if (!Command) for (const Cmd of bot.commands.values()) if (Cmd.aliases.includes(x)) Command = Cmd;
    try {
        if (!args && Command.argsRequired) return msg.channel.createMessage('Missing arguments!');
        if (!Command) throw 'No command.'
        Command.execute(msg, args, bot.prisma, guildCf);
    } catch(e) {
        if (e === 'No command.') return;
        return console.error(e);
    }
});

bot.on('guildDelete', async (guild) => {
    const guildCf = await bot.prisma.guild.findUnique({where: {id: guild.id}});
    if (!guildCf) return;
    else bot.prisma.guild.delete({where: {id: guild.id}});    
})

bot.on('error', console.error);

bot.on('ready', () => {
    console.log('Ready!');
});

try {
    bot.connect();
} catch (e) {
    console.error(e);
}