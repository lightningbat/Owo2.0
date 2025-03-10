const fs = require('fs');

const databaseMap = new Map();

function loadDatabase() {
    try {
        // check if database file exists
        if (!fs.existsSync('database.json')) {
            // if not, create it
            console.log('Database file not found. Creating a new one...');
            fs.writeFileSync('database.json', '{}');
        }
        console.log('Loading database...');
        // reading data from the file
        const data = JSON.parse(fs.readFileSync('database.json', 'utf8'));
        // saving data to the map
        databaseMap.clear();
        Object.entries(data).forEach(([key, value]) => {
            databaseMap.set(key, value);
        })
        console.log('Database loaded successfully.');
    } catch (error) {
        console.error('Error loading database:', error);
    }
}

function saveDatabase() {
    try {
        console.log('Saving database...');
        fs.writeFileSync('database.json', JSON.stringify(Object.fromEntries(databaseMap)));
        console.log('Database saved successfully.');
    } catch (error) {
        console.error('Error saving database:', error);
    }
}

module.exports = { databaseMap, loadDatabase, saveDatabase };