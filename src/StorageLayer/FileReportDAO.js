const {getConnection} = require("./connectionPool.js");
const {FileReportBean} = require("./FileReportBean.js");

class FileReportDAO{

    constructor(){}

    async getAll(){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });
    
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM FileReport";
            
            connection.all(query, (err, rows) => {
                if (err) {
                    console.log("Errore nella GetAll!");
                    reject(err);
                } else {
                    connection.close()
                    resolve(rows);
                }
            });
        });
    }

    async getAllByReportID(reportID) {
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });
    
        return new Promise((resolve, reject) => {
            let query = "SELECT * FROM FileReport WHERE Report = ?";
            
            connection.all(query, [reportID], (err, rows) => {
                if (err) {
                    console.log("Errore nella GetAllByReportID!");
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async saveFileReport(fileReport){
        const connection = await getConnection()
        .catch((error) => {
            throw (error);
        });

        return new Promise((resolve, reject) => {
            let query = "INSERT INTO FileReport (Report, Nome, PathPartenza, PathFinale) VALUES (?,?,?,?)"
            
            connection.run(query, [fileReport.idReportORG, fileReport.nome, fileReport.pathPartenza, fileReport.pathFinale], function(err) {
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
            let query = "DELETE FROM FileReport";
            
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
module.exports = {FileReportDAO};

async function testFunction() {
    const fileReportDAO = new FileReportDAO();
    const fileReportBean = new FileReportBean(1, "Pippo", "C:Folder", "H:Folder\\subfolder");

    try {
        await fileReportDAO.removeAll();
        /*await fileReportDAO.saveFileReport(fileReportBean);
        let list = await fileReportDAO.getAll();
        console.log(list);
    } catch (error) {
        console.error("Errore:", error);
    }*/
        /*await fileReportDAO.getAllByReportID(75).then((obj) =>{
            console.log(obj);
        })
        .catch((err) =>{
            console.error(err)
        }) */
    } catch (error) {
        console.error("Errore:", error);
    } 
}
//testFunction()