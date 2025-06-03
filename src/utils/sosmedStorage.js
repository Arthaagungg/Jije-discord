const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/sosmed.json');

// Load data
function load() {
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '{}');
    const raw = fs.readFileSync(dataPath);
    return JSON.parse(raw);
}

// Simpan data
function save(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Ambil data user
function getUserSocials(userId) {
    const db = load();
    return db[userId] || {};
}

// Tambah akun
function addUserSocial(userId, platform, url) {
    const db = load();
    if (!db[userId]) db[userId] = {};
    if (!db[userId][platform]) db[userId][platform] = [];
    db[userId][platform].push(url);
    save(db);
}

// Edit akun
function editUserSocial(userId, platform, index, newUrl) {
    const db = load();
    if (db[userId] && db[userId][platform] && db[userId][platform][index]) {
        db[userId][platform][index] = newUrl;
        save(db);
        return true;
    }
    return false;
}

// Hapus akun
function removeUserSocial(userId, platform, index) {
    const db = load();
    if (db[userId] && db[userId][platform] && db[userId][platform][index]) {
        db[userId][platform].splice(index, 1);
        if (db[userId][platform].length === 0) delete db[userId][platform];
        if (Object.keys(db[userId]).length === 0) delete db[userId];
        save(db);
        return true;
    }
    return false;
}

module.exports = {
    getUserSocials,
    addUserSocial,
    editUserSocial,
    removeUserSocial
};
