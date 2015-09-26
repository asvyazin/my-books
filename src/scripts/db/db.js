import PouchDB from "PouchDB"

const databaseName = "mybooks.db";
let db;

let Db = {
    instance(){
        if (!db) {
            db = new PouchDB(databaseName);
        }
        return db;
    }
};

export default Db;