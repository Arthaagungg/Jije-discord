const fs = require("fs");
const path = require("path");
const { autoPushGit } = require("./git");

const filePath = path.join(__dirname, "../data/socials.json");
const allowedPlatforms = ["tiktok", "instagram", "x"];

function readData() {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getUserSocials(userId) {
    const data = readData();
    return data[userId] || [];
}

function addSocial(userId, platform, username) {
  //  if (!allowedPlatforms.includes(platform)) throw new Error("Platform tidak valid.");

    const data = readData();
    if (!data[userId]) data[userId] = [];

    const url = `https://${platform}.com/${username}`;
    data[userId].push({ platform, url });

    writeData(data);
    autoPushGit(`[AUTO] ${userId} menambahkan sosial media ${platform}`);
}

function editSocial(userId, platform, newUsername) {
    const data = readData();
    const userData = data[userId];
    if (!userData) return false;

    const account = userData.find(s => s.platform === platform);
    if (!account) return false;

    account.url = `https://${platform}.com/${newUsername}`;
    writeData(data);
    autoPushGit(`[AUTO] ${userId} mengubah sosial media ${platform}`);
    return true;
}

function removeSocial(userId, platform, url) {
    const data = readData();
    const userData = data[userId];
    if (!userData) return false;

    const index = userData.findIndex(s => s.platform === platform && s.url === url);
    if (index === -1) return false;

    userData.splice(index, 1);
    writeData(data);
    autoPushGit(`[AUTO] ${userId} menghapus sosial media ${platform}`);
    return true;
}

module.exports = {
    getUserSocials,
    addSocial,
    editSocial,
    removeSocial,
    allowedPlatforms
};
