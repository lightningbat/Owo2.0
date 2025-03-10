require('dotenv').config();
const { loadDatabase, saveDatabase } = require('./utils/database');
let { get_bot_name, set_bot_name } = require('./variables');
const fs = require('fs');
const path = require('path');

loadDatabase();

const { Client, GatewayIntentBits } = require('discord.js');

const token = process.env.BOT_TOKEN;

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

// Event listener for when the bot is ready
client.on('ready', () => {
    set_bot_name(client.user.username);
    console.log(`Logged in as ${client.user.tag}`);
    // Optional: Set the bot's status
    client.user.setActivity({ name: 'Listening for mentions', type: 'WATCHING' });
});

const commands = new Map(); // Store commands in a Map
const commandsPath = path.join(__dirname, 'commands'); // Path to the commands folder
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // Get all command files

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath); // Import the command module
    commands.set(command.name, command); // Add command to the Map
}

// Event listener for when a message is created
client.on('messageCreate', message => {
    // Check if the bot's mentioned
    if (message.mentions.has(client.user.id)) {

        // removing unnecessary spaces from start, end and between words
        const args = message.content.toLowerCase().split(' ').filter(word => word !== '').slice(1);
        const commandName = args[0];

        const command = commands.get(commandName); // Get the command from the Map

        if (!command) {
            return message.channel.send(`Unknown command!\nUse \`@${get_bot_name()} help\` to see all available commands.`);
        }

        try {
            command.execute(message, args); // Execute the command
        } catch (error) {
            console.error(error);
            message.reply('There was an error while executing that command!');
        }
    }
});

process.on('SIGINT', () => {
    saveDatabase();
    console.log('Logging out from Discord...');
    client.destroy();
    console.log('Exiting...');
    process.exit(0);
})

console.log('Logging in to Discord...');
client.login(token);