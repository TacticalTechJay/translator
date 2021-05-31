import { Command } from 'eris';
import { inspect } from 'util';

class Evaluate extends Command {
    constructor() {
        super('eval','null', {
            aliases: ['ev'],
            argsRequired: true,
            description: 'Evaluate code bro.'
        })
        this.execute = this.exec;
    }
    
    async exec(message, args, prisma) {
        const allowed = ['127888387364487168', '328983966650728448']
        if (!allowed.includes(message.author.id)) return;
        let input = args.join(' ');
        if (input.startsWith('```js') || input.startsWith('```') && input.endsWith('```')) {
            input = input.replace(/`/gi, '')
                .replace(/js/gi, '');
        }
        try {
            let evaled = await eval(input);
            let evaluation = inspect(evaled, { depth: 0 });
            let dataType = Array.isArray(evaled) ? 'Array<' : typeof evaled, dataTypes = [];
            if (~dataType.indexOf('<')) {
                evaled.forEach(d => {
                    if (~dataTypes.indexOf(Array.isArray(d) ? 'Array' : typeof d)) return;
                    dataTypes.push(Array.isArray(d) ? 'Array' : typeof d);
                });
                dataType += dataTypes.map(s => s[0].toUpperCase() + s.slice(1)).join(', ') + '>';
            }
            if (evaluation.length >= 2000) {
                return message.channel.createMessage('Too many characters.');
            }
            return await message.channel.createMessage(`**Done Evaluation:** \`\`\`js\n${evaluation}\`\`\`\n`);
        } catch (e) {
            return await message.channel.createMessage(`**Error:** \`\`\`js\n${e.message}\`\`\``);
        }
    }
}
export default Evaluate;