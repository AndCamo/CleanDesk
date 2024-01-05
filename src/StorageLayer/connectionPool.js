import sqlite3 from "sqlite3";
import path from "path";
var separator = path.sep;

const pathname = '.'+separator+'resource'+separator+'testDB.db';

function getConnection() {
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

export {getConnection};
