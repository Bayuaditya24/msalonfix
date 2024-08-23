import { HasMany, Sequelize } from "sequelize";
import db from "../config/Database.js";
import Detail from "./DetailModel.js";

const { DataTypes } = Sequelize;

const Penjualantb = db.define(
  "penjualan",
  {
    namaPelanggan: DataTypes.STRING,
    tanggalTransaction: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

Penjualantb.hasMany(Detail, { foreignKey: "idpenjualan" });
Detail.belongsTo(Penjualantb, { foreignKey: "idpenjualan" });
export default Penjualantb;

(async () => {
  await db.sync();
})();
