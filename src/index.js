import { Client } from 'eris';
import fetch from 'petitio';


const bot = new Client(process.env.DISCORD_TOKEN, { 
    allowedMentions: {
        everyone: false,
        roles: false,
        users: false,
        repliedUser: false
    }
});

bot.on('ready', async () => {
    console.log('ready');
});

bot.on('messageCreate', async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.parentID !== '839965910378479676') return;
    if (msg.content.length > 200) return await msg.channel.createMessage({
        content: `⚠️ Please limit your message length to below 200 characters. Your current message length is ${msg.content.length}. ⚠️`,
        messageReference: {
            messageID: msg.id
        }
    });
    const channels = msg.channel.guild.channels.filter(channel => channel.parentID === '839965910378479676' && channel.name !== msg.channel.name)
    const targets = channels.map(channel => channel.name);
    let cleanContent = msg.content && msg.content.replace(/<a?(:\w+:)[0-9]+>/g, "$1") || "";
    msg.mentions?.forEach((mention) => {
        cleanContent = cleanContent.replace(new RegExp(`<@!?${mention.id}>`, "g"), "@\u200b" + mention.username);
    })
    const results = await translateText(cleanContent, targets, msg.channel.name);
    channels.forEach(async channel => {
        const translation = results[0].translations.filter(translation => translation.to === channel.name);
        return await channel.createMessage(`> ${cleanContent} -${msg.author.username} : <#${msg.channel.id}>\n${translation[0].text}`);
    })
})

bot.connect();

async function translateText(text, targets, from) {
    if (!Array.isArray(targets)) throw new Errors('Target must be an array.');
    const url = new URL(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${from}`)
    targets.forEach(target => url.searchParams.append('to', encodeURIComponent(target)));
    const results = (await fetch(url, 'POST').header('Ocp-Apim-Subscription-Key', process.env.AZURE_KEY).body([{"text": text}]).send()).json();
    return results;
}