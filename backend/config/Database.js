import { Sequelize } from "sequelize";

const db = new Sequelize("msalon_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
