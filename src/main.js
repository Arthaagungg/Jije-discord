const { spawn } = require("child_process");

function startBot() {
    const bot = spawn("node", ["src/index.js"], { stdio: "inherit" });

    bot.on("close", (code) => {
        console.log(`Bot exited with code ${code}. Restarting in 5s...`);
        setTimeout(startBot, 5000);
    });
}

startBot();