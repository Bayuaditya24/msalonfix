import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Detail from "./DetailModel.js";

const { DataTypes } = Sequelize;

const Metode = db.define(
  "metode",
  {
    metodeP: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

Metode.hasMany(Detail, { foreignKey: "metodeDet" });
Detail.belongsTo(Metode, { foreignKey: "metodeDet" });

export default Metode;

(async () => {
  await db.sync();
})();
