class ModelAdapter {

   constructor (){}

   async modelStartOrganization(path, filters){
      let result;
   const data = {
      path: path,
      filters: filters
   };

   let requestData = JSON.stringify(data);
   console.log(requestData);
   await fetch('http://127.0.0.1:5000/classify', {
      method: "POST",
      headers: {
          'Content-Type':"application/json"
      },
      body: requestData
   })
   .then(response => response.json())
   .then((data) => {
      result = data;
   })
   .catch(error => console.log(error))
   
   return result;
   }
}

module.exports = {ModelAdapter};