import mineflayer from "mineflayer";
var tpsplugin = require('mineflayer-tps')(mineflayer)
//import { mineflayer as mineflayerViewer } from "prismarine-viewer";
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
    console.log("Bot has logged in");
    console.log(username,"message:", message);
});
bot.on('login', () => {
    bot.chat(password);
    console.log("Password sent");
});

bot.on('spawn', () => {

    console.log("Bot has spawned");
    //mineflayerViewer(bot, { port: 50, firstPerson: true });
});

bot.on('kicked', console.log)
bot.on('error', console.log)