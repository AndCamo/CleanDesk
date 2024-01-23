const  { ReportORGBean } = require("../../StorageLayer/ReportORGBean");
const { ReportORG_DAO } = require("../../StorageLayer/ReportORG_DAO");
const { FileReportBean } = require("../../StorageLayer/FileReportBean");
const { FileReportDAO } = require("../../StorageLayer/FileReportDAO");
const { FileManager } = require("../FileSystemManager/FileManager");
const path = require("path");

const pathSeparator = path.sep;

class OrganizzazioneControl{

    constructor(){}

    async creaReportORG(logEntries,initPath){
        // check if the logEntries is not empty
        if (!logEntries || !Array.isArray(logEntries) || logEntries.length === 0) {
            console.error("Invalid JSON File");
            return;
        }
        
        const reportDAO = new ReportORG_DAO();
        let tdsDate = new Date().toISOString();

        //Creating a new temporary ReportBean
        const reportBean = new ReportORGBean(undefined,"","",initPath, tdsDate,"Created");
        
        //Saving in DB
        await reportDAO.saveReportORG(reportBean)
        .then((obj) =>{
            console.log("ReportORGId: " + obj.lastID);
            reportBean.id = obj.lastID;
        })
        .catch((message) => {
            console.log(message)
        }); 

        
        // For each file in the folder creates the File Report
        for (const item of logEntries){

            const fileReportDAO = new FileReportDAO();
            //Creating an object FileReport from log
            const fileReportBean = new FileReportBean(reportBean.id, item.fileName, item.filePath ,item.finalPath);

            //Saving it in DB
            await fileReportDAO.saveFileReport(fileReportBean)
            .then(async (message) =>{
                console.log(message);
            })
            .catch((message) => {
                console.log(message)
            })
        }


        const fileManager = new FileManager();
        await fileManager.moveFile(reportBean.id);

        //Updating the Report with a name and a Descriprion 
        await reportDAO.updateLastReport(reportBean.id,"Nome di prova","Descrizione di prova")
        .then((obj) =>{
            console.log(obj);
        })
        .catch((err) =>{
            console.error(err);
        })

        console.log("Classificazione e spostamento completati")

    }
}

module.exports = {OrganizzazioneControl}