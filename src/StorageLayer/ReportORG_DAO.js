const {getConnection} = require("./connectionPool.js");
const {ReportORGBean} = require("./ReportORGBean.js");

class ReportORG_DAO{

    constructor(){};

    async getAll(){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });
    
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM ReportORG ORDER BY DataReport DESC";
            
            connection.all(query, (err, rows) => {
                if (err) {
                    console.log("Errore nella GetAllReportORG!");
                    reject(err);
                } else {
                    connection.close()
                    resolve(rows);
                }
            });
        });
    }

    async getFromDateTo(dateFrom, dateTo){
        if(controlDate(dateTo) == 1){
            (dateTo instanceof Date);
                console.log("Impossibile utilizzare questa data:\n");
        } 
        else {
            const connection = await getConnection()
            .catch((error) => {
                throw (error);
            });
            return new Promise((resolve, reject) => {
                let query = "SELECT * FROM ReportORG WHERE DataReport <= ? AND DataReport >= ?"
                dateFrom = new Date(dateFrom);
                dateTo = new Date(dateTo);
                connection.all(query, [dateTo, dateFrom], (err, rows) => {
                    if (err) {
                        console.log("Errore nella getFromDateTo!");
                        reject(err);
                    } else {
                        connection.close()
                        resolve(rows);
                    }
                });
            });
        }
    }

    async saveReportORG(reportORG){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });

        return new Promise((resolve, reject) => {
            let query = "INSERT INTO ReportORG (Nome, Descrizione, NomeCartella, DataReport, StatusReport) VALUES (?,?,?,?,?)";
            
            connection.run(query, [reportORG.nome, reportORG.descrizione, reportORG.nomeCartella ,reportORG.data, reportORG.status], function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Rows inserted ${this.changes}`);
                    resolve({
                        "message": "Rows inserted" + this.changes,
                        "lastID": this.lastID
                    });
                }
            });
        });
    }

    async removeAll(){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });

        return new Promise((resolve, reject) => {
            let query = "DELETE FROM ReportORG";
            
            connection.run(query, function(err) {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Rows deleted ${this.changes}`);
                    resolve();
                }
            });
        });
    }
}

function controlDate(data){
    var tdsDate = new Date();
    if(data instanceof Date){
        if(data > tdsDate){
            return 1;
        }else return 0;
    }
}
module.exports = {ReportORG_DAO}


async function testFunction(){
    const reportORG_DAO = new ReportORG_DAO();
    const reportBean = new ReportORGBean(undefined,"NewReport","Descrizione di prova","C:prova2\\genny",new Date("2024-01-15").toDateString(),"close");


    try {
        //await reportORG_DAO.removeAll();
        await reportORG_DAO.saveReportORG(reportBean);
        //let list = await reportORG_DAO.getFromDateTo("2024-01-10","2024-01-12");
        let list = await reportORG_DAO.getAll();
        console.log(list);
    } catch (error) {
        console.error("Errore:", error);
    }
}
