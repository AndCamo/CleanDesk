const path = require("path");

class FileReportBean {
    #_idReportORG;
    #_nome;
    #_pathPartenza;
    #_pathFinale;
  
      constructor(idReportORG, nome, pathPartenza, pathFinale) { //Metodo costruttore
          this.#_idReportORG = idReportORG;
          this.#_nome = nome;
          this.#_pathPartenza = pathPartenza;
          this.#_pathFinale = pathFinale;
      }
  
      // Getter e setter per 'idReport'
    get idReportORG() {
      return this.#_idReportORG;
    }
    set idReportORG(newIdReportORG) {
      this.#_idReportORG = newIdReportORG;
    }
  
    // Getter e setter per 'nome'
    get nome() {
      return this.#_nome;
    }
    set nome(newNome) {
      this.#_nome = newNome;
    }
  
    // Getter e setter per 'pathPartenza'
    get pathPartenza() {
      return this.#_pathPartenza;
    }
    set pathPartenza(newPathPartenza) {
      this.#_pathPartenza = newPathPartenza;
    }
  
    // Getter e setter per 'pathFinale'
    get pathFinale() {
      return this.#_pathFinale;
    }
    set pathFinale(newPathFinale) {
      this.#_pathFinale = newPathFinale;
    }

    get fileDirectory() {
      let pathFinale = this.#_pathFinale;
      let pathSplit = pathFinale.split(path.sep)
      pathSplit.pop();
      let folderPath = pathSplit.join(path.sep)

      return folderPath
    }
  }
  
  module.exports = {FileReportBean};
  