const { FileReportDAO } = require("./FileReportDAO.js");
const { ReportORGBean } = require("./ReportORGBean");
const { ReportORG_DAO } = require("./ReportORG_DAO");
const {getConnection} = require("./connectionPool.js");

async function testFunction(){
    const connection = await getConnection()
    .catch((error) => {
        throw (error);
    });

    let query = "delete from ReportORG";
        
    connection.run(query, function(err) {
        if (err) {
            reject(err);
        } else {
            console.log(`Rows deleted ${this.changes}`);
            resolve();
        }
    });
}

module.exports = {testFunction}