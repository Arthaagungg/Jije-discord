const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/sosmed.json');

// Pastikan file JSON-nya selalu ada
function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}');
  }
}

function readData() {
  ensureFile();
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Ambil semua sosial media user
function getUserSocials(userId) {
  const data = readData();
  return data[userId] || {};
}

// Tambahkan sosial media (bisa banyak per platform)
function addUserSocial(userId, platform, url) {
  const data = readData();
  if (!data[userId]) data[userId] = {};
  if (!data[userId][platform]) data[userId][platform] = [];
  data[userId][platform].push(url);
  writeData(data);
}

// Edit sosial media berdasarkan index di platform
function editUserSocial(userId, platform, index, newUrl) {
  const data = readData();
  if (
    data[userId] &&
    data[userId][platform] &&
    data[userId][platform][index] !== undefined
  ) {
    data[userId][platform][index] = newUrl;
    writeData(data);
    return true;
  }
  return false;
}

// Hapus sosial media berdasarkan index di platform
function removeUserSocial(userId, platform, index) {
  const data = readData();
  if (
    data[userId] &&
    data[userId][platform] &&
    data[userId][platform][index] !== undefined
  ) {
    data[userId][platform].splice(index, 1);
    if (data[userId][platform].length === 0) {
      delete data[userId][platform];
    }
    if (Object.keys(data[userId]).length === 0) {
      delete data[userId];
    }
    writeData(data);
    return true;
  }
  return false;
}

module.exports = {
  getUserSocials,
  addUserSocial,
  editUserSocial,
  removeUserSocial,
};
