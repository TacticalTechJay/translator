import TranslateClient from './src/main.js'
import languages from './src/languages.js';

const bot = new TranslateClient(process.env.DISCORD_TOKEN);

bot.on('messageCreate', async msg => {
    if (msg.author.bot || !msg.guildID) return;
    const guildCf = await bot.prisma.guild.findUnique({ where: { id: msg.guildID }});
    if (msg.content === `<@!${bot.user.id}>`) return msg.channel.createMessage(`Prefix is \`${guildCf?.prefix || process.env.PREFIX}\``);
    if (!msg.content.startsWith(guildCf?.prefix || process.env.PREFIX)) {
        if (msg.content.length > 1024) return;
        if (!guildCf || !guildCf?.channels[0]) return;
        if (!guildCf.channels.includes(msg.channel.id)) return;
        try {
            if (!guildCf.languages[0]) return;
            const { detectedLanguage, translations } = await bot.translateText(msg.content, guildCf.languages);
            let fields = [{name: languages[detectedLanguage.language].nativeName, value: msg.content}];
            translations.filter(x => x.to !== detectedLanguage.language).forEach(x => fields.push({name: languages[x.to].nativeName, value: x.text}))
            return msg.channel.createMessage({embed: { type: "rich", fields }})
        } catch (e) {
            return console.error(e);
        }
    };
    const args = msg.content.replace(/<@!/g, "<@").substring(guildCf?.prefix?.length || process.env.PREFIX.length).trim().split(/\s+/g);
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