const fs = require('fs');
const path = require('path');
const { FileReportBean } = require('../../StorageLayer/FileReportBean');
const { FileReportDAO } = require('../../StorageLayer/FileReportDAO');

const separator = path.sep;

class FileManager {

    constructor() { }

    //Method for create all directory
    async createDir(listFileReport) {

        //For each fileReport in the list
        for (const element of listFileReport) {
            try {
                let fileReport = new FileReportBean(element.Report, element.Nome, element.PathPartenza, element.PathFinale);
                let pathString = fileReport.fileDirectory;
                // check if directory already exists
                if (!fs.existsSync(pathString)) {
                    fs.mkdirSync(pathString, { recursive: true });
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    async moveFile(reportORG_ID) {
        const fileReportDAO = new FileReportDAO();
        try {
            let arrayFileReport;
            //Calling method to take every bean of a Report Organization by ID
            await fileReportDAO.getAllByReportID(reportORG_ID)
                .then(async (rows) => {
                    arrayFileReport = rows
                })
                .catch((error) => {
                    console.error(error);
                });
            //Creating all directory
            await this.createDir(arrayFileReport).catch((err) => {
                console.error(err);
            });

            //For each fileReport
            for (const item of arrayFileReport) {
                //move from oldDirectory to new Directory
                fs.rename(item.PathPartenza, item.PathFinale, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    else {
                        console.log("File spostato correttamente")
                    }
                });
            }
        }
        catch (err) {
            throw err;
        }
    }

}
module.exports = { FileManager }

function testFunction() {
    try {
        let path = "C:\\Users\\genny\\Desktop\\Cartella_Prova1";
        let path2 = "C:\\Users\\genny\\Desktop\\Cartella_Prova1\\Prova2";
        let finalPath = path2 + "\\" + "File1.txt";
        let initialPath = path + "\\" + "File1.txt";
        console.log(initialPath);
        fs.rename(initialPath, finalPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        console.log("Path cambiato correttamente")
    }
    catch (err) {
        console.log("Errore nella rename");
        console.error(err);
    }
}
//testFunction();


