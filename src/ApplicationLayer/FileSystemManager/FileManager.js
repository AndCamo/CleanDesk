const fs = require( 'fs');
const path = require( 'path');
const { FileReportBean } = require( '../../StorageLayer/FileReportBean');
const { FileReportDAO } = require( '../../StorageLayer/FileReportDAO');
const fs = require('fs');

class FileManager{

    constructor(){}

    //Method for create all directory
    async createDir(listFileReport){

        //For each fileReport in the list
        listFileReport.forEach(element => {

            //Make destination directory if not exists
           if(!fs.existsSync(element.pathFinale)){
            fs.mkdirSync(element.pathFinale, { recursive: true });
           }
        });
    }

    async moveFile(reportORG_ID){
        const fileReportDAO = new FileReportDAO(); 
        try{
            //Calling method to take every bean of a Report Organization by ID
            await fileReportDAO.getAllByReportID(reportORG_ID)
            .then(async (listFileReport) =>{

                //Creating all directory
                await createDir(listFileReport);

                //For each fileReport
                listFileReport.forEach(item => {

                    //move from oldDirectory to new Directory
                    fs.rename(item.pathPartenza, item.pathFinale);
                });
            })
            .catch((error) =>{
                console.error(error);
            });
        }
        catch(err){
            throw err;
        }
    }
    
}
export {FileManager}