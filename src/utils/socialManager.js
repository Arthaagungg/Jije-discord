const fs = require('fs');
const path = require('path');

const dataFile = path.resolve(__dirname, '../../data/sosmed.json');

function readData() {
    if (!fs.existsSync(dataFile)) return {};
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

function getUserSocials(userId) {
    const data = readData();
    return data[userId] || [];
}

function addSocial(userId, platform, url) {
    const data = readData();

    if (!data[userId]) data[userId] = [];

    // Tambahkan akun baru
    data[userId].push({ platform, url });

    writeData(data);
}

function removeSocial(userId, platform, url) {
    const data = readData();
    if (!data[userId]) return;

    // Hapus akun yang persis cocok platform dan url
    data[userId] = data[userId].filter(s => !(s.platform === platform && s.url === url));

    writeData(data);
}

function editSocial(userId, oldPlatform, oldUrl, newUrl) {
    const data = readData();
    if (!data[userId]) return;

    const index = data[userId].findIndex(s => s.platform === oldPlatform && s.url === oldUrl);
    if (index !== -1) {
        data[userId][index].url = newUrl;
        writeData(data);
    }
}

module.exports = {
    getUserSocials,
    addSocial,
    removeSocial,
    editSocial
};
