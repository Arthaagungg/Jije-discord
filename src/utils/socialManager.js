const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/socials.json');
const allowedPlatforms = ['tiktok', 'instagram', 'x'];

function loadSocials() {
    // Baca dan parse socials.json
}

function saveSocials(data) {
    // Simpan ke file
}

function getUserSocials(userId) {
    // Ambil semua sosmed user
}

function addSocial(userId, platform, url) {
    // Tambah sosmed baru
}

function editSocial(userId, platform, oldUrl, newUrl) {
    // Edit link sosmed yang sudah ada
}

function removeSocial(userId, platform, url) {
    // Hapus link tertentu
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
