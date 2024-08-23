import { Sequelize } from "sequelize";
import Pelanggan from "../models/PelangganModel.js";

export const getPelanggan = async (req, res) => {
  try {
    const response = await Pelanggan.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const getPelangganById = async (req, res) => {
  try {
    const response = await Pelanggan.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const createPelanggan = async (req, res) => {
  try {
    await Pelanggan.create(req.body);

    res.status(201).json({ msg: "pelanggan created" });
  } catch (error) {
    console.log(error.massage);
  }
};
