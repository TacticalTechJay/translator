import { Client } from 'eris';
import fetch from 'petitio';


const bot = new Client(process.env.DISCORD_TOKEN);

bot.on('ready', async () => {
    console.log('ready');
});

bot.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (msg.author.id == '127888387364487168' && msg.channel.id == '840311970116796426') eval(msg.content);
    if (msg.channel.parentID !== '839965910378479676') return; 
    const channels = msg.channel.guild.channels.filter(channel => channel.parentID === '839965910378479676' && channel.name !== msg.channel.name)
    const targets = channels.map(channel => channel.name);
    const results = await translateText(msg.content, targets);
    channels.forEach(async channel => {
        const translation = results[0].translations.filter(translation => translation.to === channel.name);
        console.log(channel.name);
        console.log(translation[0]);
        return await channel.createMessage(`> ${msg.content} -${msg.author.username}\n${translation[0].text}`);
    })
})

bot.connect();

async function translateText(text, targets) {
    if (!Array.isArray(targets)) throw new Errors('Target must be an array.');
    const url = new URL('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0')
    targets.forEach(target => url.searchParams.append('to', target));
    const results = (await fetch(url, 'POST').header('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY).body([{"text": text}]).send()).json();
    return results;
}