import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Perawatantb from "./PerawatanModel.js";

const { DataTypes } = Sequelize;

const Categorytb = db.define(
  "category",
  {
    categoryPerawatan: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);
Categorytb.hasMany(Perawatantb, { foreignKey: "idcategory" });
Perawatantb.belongsTo(Categorytb, { foreignKey: "idcategory" });

export default Categorytb;

(async () => {
  await db.sync();
})();
