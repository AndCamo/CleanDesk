const sqlite3 = require('sqlite3').verbose();
const path = require("path");
var pathSeparator = path.sep;

const FILE_NAME = "testDB.db"
const DATABASE_PATH = path.join(__dirname, "resource",FILE_NAME); 

async function getConnection() {
    let db = new sqlite3.Database(DATABASE_PATH, (err) => {
        if (err) {
            console.log("Error in dbConnection")
            console.error(err.message);
        }
        console.log('Connected to the database.');
      });

    return db;
}

module.exports = {getConnection};


