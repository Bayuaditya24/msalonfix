import { Sequelize } from "sequelize";
import Perawatantb from "../models/PerawatanModel.js";
import Categorytb from "../models/CategoryModel.js";

export const getPerawatantb = async (req, res) => {
  try {
    const response = await Perawatantb.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const getPerawatanByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const perawatan = await Perawatantb.findAll({
      where: { idcategory: categoryId },
      include: [Categorytb],
    });
    res.status(200).json(perawatan);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getPerawatantbById = async (req, res) => {
  try {
    const response = await Perawatantb.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const createPerawatantb = async (req, res) => {
  try {
    await Perawatantb.create(req.body);

    res.status(201).json({ msg: "perawatan created" });
  } catch (error) {
    console.log(error.massage);
  }
};
