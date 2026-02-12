import statcord from '../dist/lib/index.js'
import { Client } from "oceanic.js"
import { token } from './config.mjs';

const client = new Client({
    auth: `Bot ${token}`,
    "gateway": {
        "intents": [
            "ALL_NON_PRIVILEGED"
        ]
    }
});

client.on("ready", async () => {
    console.log("Ready as", client.user.tag);

    const statcordClient = new statcord({
    })

    console.log(statcordClient.getAllStats())
});

client.on("error", (err) => {
    console.error("Something Broke!", err);
});

client.connect();