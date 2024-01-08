const sqlite3 = require("sqlite3");
const path = require("path");
var pathSeparator = path.sep;

const pathname = '.'+pathSeparator+'resource'+pathSeparator+'testDB.db';

async function getConnection() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(pathname, (err) => {
            if (err) {
                reject(new Error(err.message+": Error connection to the DB"));
            } else {
                console.log("Successful connection to the DB");
                resolve(db);
            }
        });
    });
}

module.exports = {getConnection};
