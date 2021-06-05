import { Command } from "eris";
import languages from "../languages.js";
const langKeys = Object.keys(languages);

class Language extends Command {
    constructor() {
        super('languages', 'null', {
            aliases: ['lang', 'language'],
            description: 'Include a language to translate.',
            usage: '<add/remove> <Lang>'
        })
        this.execute = async(message, args, prisma, guildCf) => {
            if (!args[0]) return message.channel.createMessage('The correct usage would be: !languages add English');
            else if (args[0].toLowerCase() === 'add') {
                if (!args[1]) return message.channel.createMessage('A language must be provided.');
                const op = langKeys.filter(a => a === args[1].toLowerCase())[0] || langKeys.filter(lang => languages[lang].name.toLowerCase() === args[1].toLowerCase())[0]
                if (!op[0]) return message.channel.createMessage('That\'s... not a valid language.')
                if (guildCf.languages.filter(lang => lang === op)[0]) return message.channel.createMessage(`Language (\`${guildCf.languages.filter(lang => lang === op)[0]}\`) is already enabled.`);
                try {
                    guildCf.languages.push(op[0]);
                    await prisma.guild.update({
                        where: { id: message.guildID },
                        data: guildCf
                    })
                    return message.channel.createMessage(`I will now${guildCf.languages.length > 1 ? ' also ' : ' '}translate messages in allowed channels to ${languages[op].name}`)    
                } catch (e) {
                    console.error(e)
                    return message.channel.createMessage('There was an issue, try again later!')
                }
            } else if (args[0].toLowerCase() === 'remove') {
                if (!args[1]) return message.channel.createMessage('A language must be provided.');
                const op = langKeys.filter(a => a === args[1].toLowerCase())[0] || langKeys.filter(lang => languages[lang].name.toLowerCase() === args[1].toLowerCase())[0]
                if (!op[0]) return message.channel.createMessage('That\'s... not a valid language.')
                if (!guildCf.languages.filter(lang => lang === op)[0]) return message.channel.createMessage(`Language (\`${guildCf.languages.filter(lang => lang === op)[0]}\`) is already enabled.`);
                try {
                    guildCf.languages = guildCf.languages.filter(lang => lang !== op[0]);
                    await prisma.guild.update({
                        where: { id: message.guildID },
                        data: guildCf
                    })
                    return message.channel.createMessage(`I will now${guildCf.languages.length > 1 ? ' also ' : ' '}translate to ${languages[op].name}`)    
                } catch (e) {
                    console.error(e)
                    return message.channel.createMessage('There was an issue, try again later!')
                }
            } else return message.channel.createMessage('The correct usage would be: !languages add English');
            return message.channel.createMessage('WHAT!?')
        }
    }
}

export default Language