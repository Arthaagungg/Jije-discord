const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/sosmed.json');
const allowedPlatforms = ['tiktok', 'instagram', 'x'];

/**
 * Load data sosial media dari file JSON
 */
function loadSocials() {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }

    const raw = fs.readFileSync(filePath);
    return JSON.parse(raw);
}

/**
 * Simpan data sosial media ke file JSON
 */
function saveSocials(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * Ambil semua sosmed milik user
 */
function getUserSocials(userId) {
    const data = loadSocials();
    return data[userId] || [];
}

/**
 * Tambahkan sosial media untuk user
 */
function addSocial(userId, platform, url) {
    if (!allowedPlatforms.includes(platform)) {
        throw new Error('Platform tidak valid.');
    }

    const data = loadSocials();
    if (!data[userId]) data[userId] = [];

    data[userId].push({ platform, url });
    saveSocials(data);
}

/**
 * Edit sosial media user
 */
function editSocial(userId, platform, oldUrl, newUrl) {
    const data = loadSocials();
    if (!data[userId]) return false;

    const index = data[userId].findIndex(
        (entry) => entry.platform === platform && entry.url === oldUrl
    );

    if (index === -1) return false;

    data[userId][index].url = newUrl;
    saveSocials(data);
    return true;
}

/**
 * Hapus sosial media user
 */
function removeSocial(userId, platform, url) {
    const data = loadSocials();
    if (!data[userId]) return false;

    const before = data[userId].length;
    data[userId] = data[userId].filter(
        (entry) => !(entry.platform === platform && entry.url === url)
    );

    const after = data[userId].length;

    if (before === after) return false;

    saveSocials(data);
    return true;
}

module.exports = {
    loadSocials,
    saveSocials,
    getUserSocials,
    addSocial,
    editSocial,
    removeSocial,
    allowedPlatforms
};
