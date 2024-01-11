const {getConnection} = require("./connectionPool.js");
const {ReportORGBean} = require("./ReportORGBean.js");

class ReportORG_DAO{

    constructor(){};

    async getAll(){
        return new Promise(async(resolve, reject) =>{
            try {
                const connection = await getConnection();
                
                connection.all("SELECT * FROM ReportORG ORDER BY DataReport DESC", (err,rows) =>{
                    if(err){
                        reject(new Error("Error retriving objects from DB"));
                    }
                    else{
                        resolve(rows);
                    }
                    connection.close();
                });
            }
            catch(error){
                reject(error);
            }
        });
    }

    async getFromDateTo(dateFrom, dateTo){
        if(controlDate(dateTo) == 1){
            (dateTo instanceof Date);
                console.log("Impossibile utilizzare questa data:\n");
        } 
        else {
            return new Promise(async(resolve, reject) => {
                try{
                    const connection = await getConnection();
                    var query = "SELECT * FROM ReportORG WHERE DataReport <= ? AND DataReport >= ?"

                    connection.all(query,[dateTo, dateFrom], (err, rows) =>{
                        if(err){
                            reject("Error retriving objects from DB");
                        }
                        else{
                            resolve(rows);
                        }
                        connection.close();
                    });
                }
                catch(error){
                    reject(error);
                }
            });
        }
    }
    async saveReportORG(ReportORG){
        return new Promise(async (resolve, reject) => {
            try{
                const connection = await getConnection(); 
                var query = "INSERT INTO ReportORG (Nome, Descrizione, NomeCartella, DataReport, StatusReport) VALUES (?,?,?,?,?)";
    
    
                connection.run(query,[ReportORG.nome, ReportORG.descrizione, ReportORG.nomeCartella ,ReportORG.data, ReportORG.status], (err) =>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve("Inserimento avvenuto con successo");
                    }
                });
            }catch(err){
                throw err;
            }
        });
    }

    async removeAll(){
        return new Promise(async(resolve, reject) =>{
            try{

                const connection = await getConnection();
                let query = "DELETE FROM ReportORG";

                connection.run(query,[],(err) =>{
                    if(err){
                        reject(err);
                    }else{
                        resolve("Cancellazione effettuata con successo");
                    }
                });
            }
            catch(err){
                throw err;
            }
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
    const reportBean = new ReportORGBean(undefined,"Prova1","Descrizione di prova","C:prova2\\genny",new Date(),"close");
        //Calling method saveReport 
        /*await reportORG_DAO.saveReportORG(reportBean).then((obj) =>{
            console.log(obj);
        })
        .catch((error) => {
            console.error(error);
        });*/
        
        //Calling method getAll
        await reportORG_DAO.getAll().then((objs) =>{
            console.log("GetAll objs: ", objs)
        })
        .catch((error) => {
            console.error(error.message);
        });

        //Calling method removeAll
        /*await reportORG_DAO.removeAll()
        .then((obj) =>{
            console.log(obj);
        })
        .catch((err) =>{
            console.log(err)
        });*/
    }
