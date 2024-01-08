import { ReportORGBean } from "../../StorageLayer/ReportORGBean";
import { ReportORG_DAO } from "../../StorageLayer/ReportORG_DAO";
import { FileReportBean } from "../../StorageLayer/FileReportBean";
import { FileReportDAO } from "../../StorageLayer/FileReportDAO";
import { FileManager, FileManager } from "../FileSystemManager/FileManager";
import path from "path";

class OrganizzazioneControl{

    creaReportORG(logEntries,initPath){
        // check if the logEntries is not empty
        if (!logEntries || !Array.isArray(logEntries) || jsonLog.length === 0) {
            console.error("Invalid jsonLog");
            return;
        }
        const reportDAO = new ReportORG_DAO();
        tsDate = new Date();

        //Creating a new temporary ReportBean
        const reportBean = new ReportORGBean(undefined,"","",initPath, tsDate,"Created");

        //Saving in DB
        reportDAO.saveReportORG(reportBean); 

        const fileReportDAO = new FileReportDAO();

        //For each log in Json file
        logEntries.forEach(item => {

            //Instantiate a variable representing the final path
            let finalPath = path.join(initPath,item.category);

            //Creating an object FileReport from log
            const fileReportBean = new FileReportBean(reportBean.id, item.fileName, finalPath);

            //Saving it in DB
            fileReportDAO.saveFileReport(fileReportBean);

        });
        const fileManager = new FileManager();
        fileManager.moveFile(reportBean.id);
    }
}