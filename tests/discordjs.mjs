import statcord from '../dist/lib/index.js'
import { token } from './config.mjs';

import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const statcordClient = new statcord({
        "apiKey": "dsaf",
        "botId": "dsaf",
        "discordClient": client,
        "discordLibrary": "discord.js"
    })

    statcordClient.startAutoPost()
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login(token);