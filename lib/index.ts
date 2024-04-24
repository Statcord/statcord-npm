import type { optionsType, postObject } from "./types/types";
import os from "node:os"

const baseURL = "https://statcord.com"

export default class {
    private apiKey: string
    private botId: string
    private discordLibrary: string
    private discordClient: object

    private commandsRun: Map<string, number>
    private activeUsers: Map<string, number>
    private customCharts: Map<string, object>

    private autoPostingStarted: boolean
    private autoPostingInterval: number

    private totalRam: number

    private getUserCount: Function | undefined

    constructor(options: optionsType) {
        if (!options.apiKey) throw new TypeError("No API key provided.")
        if (!options.botId) throw new TypeError("No bot ID provided.")
        if (!options.discordLibrary) throw new TypeError("No discord Library provided.")
        if (!options.discordClient) throw new TypeError("No discord Library provided.")

        this.apiKey = options.apiKey
        this.botId = options.botId
        this.discordLibrary = options.discordLibrary
        this.discordClient = options.discordClient

        this.autoPostingStarted = false
        this.autoPostingInterval = options.autoPostingInterval ?? 60

        this.totalRam = os.totalmem()

        this.commandsRun = new Map()
        this.activeUsers = new Map()
        this.customCharts = new Map()

        if (options.overrideGetUserCount) this.getUserCount = options.overrideGetUserCount
    }

    startAutoPost() {
        if (!this.autoPostingStarted) setInterval(this.postBotStats, this.autoPostingInterval * 1000)
        this.autoPostingStarted = true

        this.postBotStats()
    }

    commandRun(commandName: string, userID?: string) {
        if (!commandName || commandName.trim() === "") return new TypeError("No command name provided to commandRun().")

        const commandRun = this.commandsRun.get(commandName)
        this.commandsRun.set(commandName, commandRun ? (commandRun + 1) : 1)


        if (userID){
            const userCommandsRun = this.activeUsers.get(userID)
            this.activeUsers.set(userID, userCommandsRun ? (userCommandsRun + 1) : 1)
        }   
    }

    addCustom(chartID: string, data: object, ) {
        this.customCharts.set(chartID, data)
    }


    private getBotStats() {
        const customUserCount = this.getUserCount ? this.getUserCount() : undefined
        switch (this.discordLibrary) {
            case "eris":
            case "oceanic.js": {
                return {
                    // @ts-ignore
                    "guildCount": this.discordClient.guilds.size,
                    // @ts-ignore
                    "shardCount": this.discordClient.shards.size,

                    "userCount": customUserCount ?? this.activeUsers.size,

                    // @ts-ignore
                    "members": this.discordClient.guilds.reduce((a, i) => a + i.memberCount, 0)
                }
            }
            case "discord.js": {
                // @ts-ignore
                return {
                    // @ts-ignore
                    "guildCount": this.discordClient.guilds.cache.size,
                    // @ts-ignore
                    "shardCount": this.discordClient.shard ? this.discordClient.shard.count : 1,

                    "userCount": customUserCount ?? this.activeUsers.size,

                    // @ts-ignore
                    "members": this.discordClient.guilds.cache.reduce((a, i) => a + i.memberCount, 0)
                }
            }
        }
    }

    private getHostUsage() {
        const cpus = os.cpus()

        let totalTime = 0
        let totalIdle = 0

        for (let i = 0; i < cpus.length; i++) {
            const cpu = cpus[i]
            let type: keyof typeof cpu.times;
            for (type in cpu.times) {
                totalTime += cpu.times[type];
                if (type == "idle") {
                    totalIdle += cpu.times[type];
                }
            }
        }


        return {
            cpuUsage: 100 - Math.round(totalIdle / totalTime * 100),
            ramUsage: 100 - Math.round(os.freemem() / this.totalRam * 100),
            totalRam: this.totalRam
        }
    }

    private getcommandUsage() {
        return {
            "topCommands": Array.from(this.commandsRun, ([name, count]) => {
                return { name, count };
            })
        }
    }

    private getAllStats() {
        return {
            ...this.getHostUsage(),
            ...this.getBotStats(),
            ...this.getcommandUsage(),
            ...this.getCustomCharts()
        }
    }

    private getCustomCharts() {
        return {
            "customCharts": Array.from(this.customCharts, ([id, data]) => {
                return { id, data };
            })
        }
    }

    postBotStats(stats?: object) {
        if (!this.autoPostingStarted && !stats) return new TypeError("No stats to post.")

        const statsToPost = stats ? stats : this.getAllStats()
   
        this.post(statsToPost)
    }

    private post(body: postObject) {
        // console.log(body)
        const fetchResult = fetch(`${baseURL}/api/bots/${this.botId}/stats`, {
            "method": "post",            
            "headers": {
                "Content-Type": "application/json",
                'Authorization': this.apiKey
            },
            "body": JSON.stringify(body)
        })

        this.commandsRun.clear() 
    }
}