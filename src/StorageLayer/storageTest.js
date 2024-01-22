const { ReportORGBean } = require("./ReportORGBean");
const { ReportORG_DAO } = require("./ReportORG_DAO");

async function testFunction(){
   const reportORG_DAO = new ReportORG_DAO();

   dateTo = "2024-01-18";
   
   dateFrom = "2024-01-09";
   
   reportORG_DAO.getFromDateTo(dateFrom, dateTo)
   .then((list) => {
        console.log(list);
    })
    .catch((error) => {
        console.log(error)
    });
}

testFunction()

module.exports = {testFunction}