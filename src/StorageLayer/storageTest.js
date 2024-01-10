const { ReportORGBean } = require("./ReportORGBean");
const { ReportORG_DAO } = require("./ReportORG_DAO");

async function testFunction(){
   const reportORG_DAO = new ReportORG_DAO();
   const reportBean = new ReportORGBean(undefined,"Prova1","Descrizione di prova","C:prova2\\genny",new Date(),"close");
       await reportORG_DAO.saveReportORG(reportBean).then((obj) =>{
           console.log("Insert Objs: ",obj);
       })
       .catch((error) => {
           console.error(error);
       });
       
       await reportORG_DAO.getAll().then((objs) =>{
           console.log("GetAll objs: ", objs)
       })
       .catch((error) => {
           console.error(error.message);
       });
}


module.exports = {testFunction}