const { exec } = require("child_process");

function autoPushGit(message = "update socials.json") {
    exec(`git add data/socials.json && git commit -m "${message}" && git push`, (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Gagal push ke GitHub:\n", stderr);
        } else {
            console.log("✅ Berhasil push ke GitHub:\n", stdout);
        }
    });
}

module.exports = { autoPushGit };
