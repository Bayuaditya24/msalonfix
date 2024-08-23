import { Sequelize } from "sequelize";
import Detail from "../models/DetailModel.js";

export const getDetail = async (req, res) => {
  try {
    const resAPI = await Detail.findAll();
    res.status(201).json(resAPI);
  } catch (error) {
    console.log(error.massage);
  }
};

export const getDetailById = async (req, res) => {
  try {
    const response = await Detail.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(202).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const createDetail = async (req, res) => {
  try {
    await Detail.create({
      perawatanPelanggan: req.body.perawatanPelanggan,
      hargaP: req.body.hargaP,
      quantityP: req.body.quantityP,
      totalHarga: req.body.totalHarga,
      grandtotal: req.body.grandtotal,
      metodeDet: req.body.metodeDet,
      idpenjualan: req.body.idpenjualan,
      karyawanNote: req.body.karyawanNote,
    });

    res.status(202).json({ msg: "detail created" });
  } catch (error) {
    console.log(error.massage);
  }
};

export const updateDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { hargaP, totalHarga, grandtotal } = req.body;

    await Detail.update({ hargaP, totalHarga, grandtotal }, { where: { id } });

    res.status(200).json({ msg: "Detail updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
