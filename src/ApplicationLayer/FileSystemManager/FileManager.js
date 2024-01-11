const fs = require( 'fs');
const path = require( 'path');
const { FileReportBean } = require( '../../StorageLayer/FileReportBean');
const { FileReportDAO } = require( '../../StorageLayer/FileReportDAO');

const separator = path.sep;

class FileManager{

    constructor(){}

    //Method for create all directory
    async createDir(listFileReport){

        //For each fileReport in the list
        for(const element of listFileReport){
            try {
                // check if directory already exists
                if (!fs.existsSync(element.pathFinale)) {
                    fs.mkdirSync(element.pathFinale);
                    console.log("Directory is created.");
                } else {
                    console.log("Directory already exists.");
                }
            } catch (err) {
                console.log(err);
            }
        }
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
                for(const item of listFileReport){

                     //move from oldDirectory to new Directory
                    fs.rename(item.pathPartenza, item.pathFinale, (err)=>{
                        if(err){
                            console.log(err.message);
                        }
                        else{
                            console.log("File spostato correttamente")
                        }
                    });
                }
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
module.exports = {FileManager}

function testFunction(){
    try{
        let path = "C:\\Users\\genny\\Desktop\\Cartella_Prova1";
        let path2 = "C:\\Users\\genny\\Desktop\\Cartella_Prova1\\Prova2";
        let finalPath = path2 + separator+ "File1.txt"; 
        let initialPath = path + separator + "File1.txt"; 
        fs.rename(initialPath, finalPath, function (err) {
            if (err) throw err
            console.log('Successfully renamed - AKA moved!')
          })
        console.log("Path cambiato correttamente")
    }
    catch(err){
        console.log("Errore nella rename");
        console.error(err);
    }
   
}

