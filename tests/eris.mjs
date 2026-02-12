import statcord from '../dist/lib/index.js'
import Eris from 'eris';
import { token } from './config.mjs';

const bot = new Eris(`Bot ${token}`, {
    intents: [
        "allNonPrivileged"
    ]
});

bot.on("ready", () => { // When the bot is ready
    console.log("Ready!"); // Log "Ready!"
    const statcordClient = new statcord({
        "apiKey": "dsaf",
        "botId": "dsaf",
        "discordClient": bot,
        "discordLibrary": "eris"
    })

    statcordClient.startAutoPost()
    // console.log(statcordClient.getAllStats())
});

bot.on("error", (err) => {
    console.error(err); // or your preferred logger
});

bot.connect(); // Get the bot to connect to Discord