const  { ReportORGBean } = require("../../StorageLayer/ReportORGBean");
const { ReportORG_DAO } = require("../../StorageLayer/ReportORG_DAO");
const { FileReportBean } = require("../../StorageLayer/FileReportBean");
const { FileReportDAO } = require("../../StorageLayer/FileReportDAO");
const { FileManager } = require("../FileSystemManager/FileManager");
const path = require("path");

const pathSeparator = path.sep;

class OrganizzazioneControl{

    constructor(){}

    creaReportORG(logEntries,initPath){
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
        reportDAO.saveReportORG(reportBean); 

        const fileReportDAO = new FileReportDAO();

        //For each log in Json file
        logEntries.forEach((item) => {

            //Instantiate a variable representing the final path
            let finalPath = initPath + pathSeparator + item.category;

            //Creating an object FileReport from log
            const fileReportBean = new FileReportBean(reportBean.id, item.fileName, finalPath);

            //Saving it in DB
            fileReportDAO.saveFileReport(fileReportBean);

        });
        const fileManager = new FileManager();
        fileManager.moveFile(reportBean.id);
    }
}