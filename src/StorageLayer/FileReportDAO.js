const {getConnection} = require("./connectionPool.js");
const {FileReportBean} = require("./FileReportBean.js");

class FileReportDAO{

    constructor(){}

    async getAll(){
        return new Promise(async(reject, resolve) =>{
            try{
                const connection = await getConnection();
                var query = "SELECT * FROM FileReport";
                
                connection.all(query, (err, rows) =>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                    connection.close();
                });
            } catch(err){
                throw (err)
            }
        });
    }

    async getAllByReportID(reportID){
        return new Promise(async(reject, resolve) =>{
            try{
                const connection = await getConnection();
                var query = "SELECT * FROM FileReport WHERE Report = ?";
                
                connection.all(query,[reportID], (err, rows) =>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(rows);
                    }
                    connection.close();
                });
            } catch(err){
                throw (err)
            }
        });
    }

    async saveFileReport(fileReport){
        return new Promise(async(reject, resolve) =>{
            try{
                const connection = await getConnection();
                var query = "INSERT INTO FileReport (Report, Nome, PathPartenza, PathFinale) VALUES (?,?,?,?)"

                connection.run(query,[fileReport.idReportORG, fileReport.nome, fileReport.pathPartenza, fileReport.pathFinale], (err) =>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve("Inserimento effettuato correttamente");
                    }
                    connection.close();
                });
            }
            catch(err){
                throw err;
            }
        });
    }

    async removeAll(){
        return new Promise(async(reject,resolve) =>{
            try{
                const connection = await getConnection();

                var query = "DELETE FROM FileReport";
                connection.run(query,[],(err) =>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve("Cancellazione eseguita con successo");
                    }
                    connection.close();
                });
            }
            catch(err){
                throw (new Error(err));
            }
        });
    }
}
module.exports = {FileReportDAO};

async function testFunction(){
    const fileReportDAO = new FileReportDAO();
    const fileReportBean = new FileReportBean(1,"FileReportProva1","C:Cartella1","H:Cartella1\\sottocartella1")

    await fileReportDAO.getAll()
        .then((obj) =>{
            obj.forEach(item => {
                console.log(item.reportIDORG);
                console.log(item.nome)
                console.log(item.pathPartenza);
                console.log(item.pathFinale);
            });
        })
        .catch((error) =>{
            console.error(error);
        })
}

