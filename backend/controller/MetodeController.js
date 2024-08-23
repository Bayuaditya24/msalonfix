import { Sequelize } from "sequelize";
import Metode from "../models/MetodeModel.js";

export const getMetode = async (req, res) => {
  try {
    const response = await Metode.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const getMetodeById = async (req, res) => {
  try {
    const response = await Metode.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const createMetode = async (req, res) => {
  try {
    await Metode.create(req.body);

    res.status(201).json({ msg: "Method created" });
  } catch (error) {
    console.log(error.massage);
  }
};
