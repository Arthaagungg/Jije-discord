const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/sosmed.json');

// Pastikan file ada
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '{}');
}

function loadData() {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
  getUserSocials(userId) {
    const data = loadData();
    return data[userId] || {};
  },

  setUserSocial(userId, platform, username) {
    const data = loadData();
    if (!data[userId]) data[userId] = {};
    data[userId][platform] = username;
    saveData(data);
  },

  deleteUserSocial(userId, platform) {
    const data = loadData();
    if (data[userId]) {
      delete data[userId][platform];
      saveData(data);
    }
  },

  getAllSocials() {
    return loadData();
  }
};
