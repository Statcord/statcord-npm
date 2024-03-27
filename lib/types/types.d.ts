export interface optionsType {
    /**
     * Statcord bot API key
     * @defaultValue null
    */
    apiKey: string
    /**
     * The discord bot ID
     * @defaultValue null
    */
    botId: string
    /**
     * The interval between posts in seconds
     * @defaultValue 60
    */
    autoPostingInterval?: number
    /**
     * The discord client to pull stats from 
     * @defaultValue null
    */
    discordClient: object
    /**
     * The discord client library being used
     * @defaultValue null
    */
    discordLibrary: "discord.js" | "oceanic.js" | "eris"
}

export interface postObject {
    guildCount?: number
    shardCount?: number
    userCount?: number
    members?: number
    ramUsage?: number
    totalRam?: number
    cpuUsage?: number
    customCharts?: customChartBody
    // "topCommands": [
    //     {
    //     "name": "help",
    //     "count": 10
    //     }
    // ]
}

export interface customChartBody {
    "id": string,
    "data": object
}
