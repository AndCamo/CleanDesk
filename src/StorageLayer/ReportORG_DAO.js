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
            const connection = await getConnection().catch((error) => {
                throw (error);
            });
            let query = "SELECT * FROM ReportORG WHERE DataReport <= ? AND DataReport >= ?";
           

            return await new Promise((resolve, reject) => {
                connection.all(query, [dateTo, dateFrom], (err, rows) => {
                    if (err) {
                        console.log("Errore nella getFromDateTo!");
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.close();
                });
            });
    }

    async getReportUntil(dateTo){        
        const connection = await getConnection().catch((error) => {
            throw (error);
        });

        let query = "SELECT * FROM ReportORG WHERE DataReport <= ?";
        return await new Promise((resolve, reject) => {
            connection.all(query, [dateTo], (err, rows) => {
                if (err) {
                    console.log("Errore nella getFromDateTo!");
                    reject(err);
                } else {
                    resolve(rows);
                }
                connection.close();
            });
        });
}

    async saveReportORG(reportORG){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });

        return new Promise((resolve, reject) => {
            let query = "INSERT INTO ReportORG (Nome, Descrizione, NomeCartella, DataReport, StatusReport) VALUES (?,?,?,date(?),?)";
            
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

    async removeByID(reportID){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });

        return new Promise((resolve, reject) => {
            let query = "DELETE FROM ReportORG WHERE ID = "+ reportID;
            console.log(query);
            
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

    async updateLastReport(reportID,nome, descrizione){
        const connection = await getConnection()
        .catch((err) =>{
            throw(err)
        });
    

        return new Promise((resolve, reject) =>{
            let status = "Closed"
            let query = "UPDATE ReportORG "+ 
            "SET Nome = ?, Descrizione = ?, StatusReport = ? "+
            "WHERE ID = ?";
            let data = [nome,descrizione,status,reportID]
            connection.run(query,data, (err) =>{
                if(err){
                    reject(err);
                }
                else{
                    console.log(this.changes + " record(s) updated");
                    resolve("Update effettuato con successo");
                }
            });
            connection.close()
        });
    }

    async getReportByID(reportID){
        const connection = await getConnection()
        .catch((err) =>{
            throw(err)
        });
        return new Promise((resolve,reject) =>{
            console.log(reportID);
            let query = "SELECT * FROM ReportORG WHERE ID = "+ reportID;
            connection.all(query, (err, row) =>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(row);
                }
            });
        });
    }
}

module.exports = {ReportORG_DAO}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


async function testFunction(){
    let date = new Date("2024-01-20").toISOString();
    const reportORG_DAO = new ReportORG_DAO();
    const reportBean = new ReportORGBean(undefined,"NewReport","Descrizione di prova","C:prova2\\genny",date,"close");

    /*await reportORG_DAO.saveReportORG(reportBean)
    .then((obj) =>{
        console.log(obj);
    })
    .catch((err) =>{
        console.log(err);
    })*/

    /*await reportORG_DAO.removeAll().then((obj) =>{
        console.log(obj);
    })
    .catch((err) =>{
        console.error(err)
    });

    /*await reportORG_DAO.getAll().then((obj) =>{
        console.log(obj);
    })
    .catch((err) =>{
        console.error(err)
    });*/
    

    /*await reportORG_DAO.updateLastReport(71,"Nome di prova", "Descrizione di prova")
    .then((obj)=>{
        console.log(obj);
    })
    .catch((err) =>{
        console.error(err)
    });*/


    /*await reportORG_DAO.getAll().then((obj) =>{
        console.log(obj);
    })
    .catch((err) =>{
        console.error(err)
    })*/

     /*await reportORG_DAO.getReportByID(104)
     .then((obj) =>{
        console.log(obj);
    })
    .catch((err) =>{
        console.error(err)
    })*/
}
//testFunction()