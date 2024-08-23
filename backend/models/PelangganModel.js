import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Pelanggan = db.define(
  "pelanggan",
  {
    namaPelanggan: DataTypes.STRING,
    nohp: DataTypes.STRING,
    alamat: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Pelanggan;

(async () => {
  await db.sync();
})();
