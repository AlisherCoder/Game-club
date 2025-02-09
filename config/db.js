import mysql from "mysql2/promise";

const db = await mysql
   .createConnection({
      host: "localhost",
      user: "root",
      password: "953901313",
      database: "gameclub",
   })
   .then(console.log("Database connected successfully"))
   .catch((error) => {
      console.log(error.message);
   });
export default db;
