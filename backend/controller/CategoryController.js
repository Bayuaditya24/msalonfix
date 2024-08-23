import { Sequelize } from "sequelize";
import Category from "../models/CategoryModel.js";

export const getCategory = async (req, res) => {
  try {
    const response = await Category.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const response = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const createCategory = async (req, res) => {
  try {
    await Category.create(req.body);

    res.status(201).json({ msg: "Category created" });
  } catch (error) {
    console.log(error.massage);
  }
};
