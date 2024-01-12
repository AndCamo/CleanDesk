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
        console.log(logEntries);
        // check if the logEntries is not empty
        if (!logEntries || !Array.isArray(logEntries) || logEntries.length === 0) {
            console.error("Invalid JSON File");
            return;
        }
        const reportDAO = new ReportORG_DAO();
        let tsDate = new Date();

        //Creating a new temporary ReportBean
        const reportBean = new ReportORGBean(undefined,"","",initPath, tsDate,"Created");
        
        //Saving in DB
        await reportDAO.saveReportORG(reportBean)
        .then((obj) =>{
            console.log("ReportORGId: " + obj.lastID);
            reportBean.id = obj.lastID;
        })
        .catch((message) => {
            console.log(message)
        }); 

        /*const fileReportDAO = new FileReportDAO();
        await fileReportDAO.removeAll().then((obj) =>
            console.log(obj)
        ).catch((err) => {
            console.error(err)
        })
*/


        for (const item of logEntries){

            //Instantiate a variable representing the final path
            let finalPath = initPath + pathSeparator + item.category;
            const fileReportDAO = new FileReportDAO();

            //Creating an object FileReport from log
            const fileReportBean = new FileReportBean(reportBean.id, item.fileName, item.filePath ,finalPath);
            

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
    }
}

module.exports = { OrganizzazioneControl }