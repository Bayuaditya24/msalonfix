import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Detail = db.define(
  "detail",
  {
    perawatanPelanggan: DataTypes.STRING,
    hargaP: DataTypes.FLOAT, // Ganti STRING dengan FLOAT
    quantityP: DataTypes.INTEGER, // Ganti STRING dengan INTEGER
    totalHarga: DataTypes.FLOAT, // Ganti STRING dengan FLOAT
    grandtotal: DataTypes.FLOAT, // Ganti STRING dengan FLOAT
    metodeDet: DataTypes.INTEGER,
    karyawanNote: DataTypes.STRING,
    idpenjualan: DataTypes.INTEGER,
  },
  {
    freezeTableName: true,
  }
);

export default Detail;

(async () => {
  await db.sync();
})();
