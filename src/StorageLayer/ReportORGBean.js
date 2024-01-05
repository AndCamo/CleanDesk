class ReportORGBean {
    #_id;
    #_nome;
    #_descrizione;
    #_nomeCartella;
    #_data;
    #_status;

    constructor(id, nome, descrizione, nomeCartella, data, status) { //costruttore
      this.#_id = id;
      this.#_nome = nome;
      this.#_descrizione = descrizione;
      this.#_nomeCartella = nomeCartella;
      this.#_data = data;
      this.#_status = status;
    }
  
    // Getter e setter per l'attributo 'id'
    get id() {
      return this.#_id;
    }
    set id(newId) {
      this.#_id = newId;
    }
  
    // Getter e setter per l'attributo 'nome'
    get nome() {
      return this.#_nome;
    }
    set nome(newNome) {
      this.#_nome = newNome;
    }
  
    // Getter e setter per l'attributo 'descrizione'
    get descrizione() {
      return this.#_descrizione;
    }
    set descrizione(newDescrizione) {
      this.#_descrizione = newDescrizione;
    }
  
    // Getter e setter per l'attributo 'nomeCartella'
    get nomeCartella() {
      return this.#_nomeCartella;
    }
    set nomeCartella(newNomeCartella) {
      this.#_nomeCartella = newNomeCartella;
    }
  
    // Getter e setter per l'attributo 'data'
    get data() {
      return this.#_data;
    }
    set data(newData) {
      this.#_data = newData;
    }
  
    // Getter e setter per l'attributo 'status'
    get status() {
      return this.#_status;
    }
    set status(newStatus) {
      this.#_status = newStatus;
    }
}

export {ReportORGBean};
