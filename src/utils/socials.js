const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/socials.json");

const platformUrlPrefixes = {
  tiktok: "https://tiktok.com/@",
  instagram: "https://instagram.com/",
  x: "https://x.com/"
};

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
  if (!platformUrlPrefixes[platform]) throw new Error("Platform tidak valid.");
  const url = platformUrlPrefixes[platform] + username;

  const data = readData();
  if (!data[userId]) data[userId] = [];

  data[userId].push({ platform, url });
  writeData(data);
}

function editSocial(userId, platform, newUsername) {
  const data = readData();
  const userData = data[userId];
  if (!userData) return false;

  const account = userData.find(s => s.platform === platform);
  if (!account) return false;

  account.url = platformUrlPrefixes[platform] + newUsername;
  writeData(data);
  return true;
}

function removeSocial(userId, platform, username) {
  const expectedUrl = platformUrlPrefixes[platform] + username;

  const data = readData();
  const userData = data[userId];
  if (!userData) return false;

  const index = userData.findIndex(s => s.platform === platform && s.url === expectedUrl);
  if (index === -1) return false;

  userData.splice(index, 1);
  writeData(data);
  return true;
}

module.exports = {
  getUserSocials,
  addSocial,
  editSocial,
  removeSocial,
  allowedPlatforms: Object.keys(platformUrlPrefixes)
};
