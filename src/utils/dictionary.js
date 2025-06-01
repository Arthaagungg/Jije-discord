const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/dictionary.json');

function loadDictionary() {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

function saveDictionary(dict) {
    fs.writeFileSync(filePath, JSON.stringify(dict, null, 2), 'utf8');
}

module.exports = {
    loadDictionary,
    saveDictionary
};