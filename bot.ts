import mineflayer from "mineflayer";
var tpsplugin = require('mineflayer-tps')(mineflayer)
const mineflayerViewer = require('prismarine-viewer').mineflayer
var password = '/login serverbt';
var tpa = '/tpa exdv';

const bot = mineflayer.createBot({
    username: 'serverbot',
    host: "monyxnetwork.xyz",
    port: 25565,
    version: "1.21",
    auth: "offline",
})

bot.loadPlugin(tpsplugin);

bot.on("chat", (username, message) => {
    if (username === bot.username) return;
    if (message === "tps") {
        bot.chat("Current Tps: " + bot.getTps());
    }
    else if (message === "tpa") {
        bot.chat(tpa);
        console.log("Tpa sent");
    }
    bot.setControlState('forward', true); // Move forward
    setTimeout(() => bot.clearControlStates(), 250);
});

bot.on("message", (jsonMsg) => {
    if (jsonMsg.toString() == "tps") {
        bot.chat("CURRENT TPS: " + bot.getTps());
    }
    console.log("[System] [CHAT]", jsonMsg.toString()); // Log the message to the console
});

bot.on('login', () => {
    bot.chat(password);
    console.log("Password sent");
});

bot.on('spawn', () => {
    try {
        //mineflayerViewer(bot, { firstPerson: true, port: 500 });
        console.log("Viewer initialized on port 50");
    } catch (error) {
        console.error("Failed to initialize viewer:", error);
    }
});

bot.on('kicked', console.log)
bot.on('error', console.log)