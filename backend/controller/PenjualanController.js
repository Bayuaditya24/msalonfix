import Penjualantb from "../models/PenjualanModel.js";
import Detail from "../models/DetailModel.js";

export const getPenjualantb = async (req, res) => {
  try {
    const penjualan = await Penjualantb.findAll({
      include: {
        model: Detail,
        attributes: [
          "perawatanPelanggan",
          "hargaP",
          "quantityP",
          "totalHarga",
          "grandtotal",
          "metodeDet",
          "karyawanNote",
        ],
      },
      attributes: ["namaPelanggan", "tanggalTransaction"],
    });

    // Kelompokkan data berdasarkan namaPelanggan dan tanggalTransaction
    const groupedData = penjualan.reduce((acc, item) => {
      const key = `${item.namaPelanggan}-${item.tanggalTransaction}`;
      if (!acc[key]) {
        acc[key] = {
          namaPelanggan: item.namaPelanggan,
          tanggalTransaction: item.tanggalTransaction,
          details: [],
        };
      }
      acc[key].details.push(...item.details);
      return acc;
    }, {});

    // Konversi objek menjadi array
    const result = Object.values(groupedData);

    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPenjualantbById = async (req, res) => {
  try {
    const response = await Penjualantb.findOne({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    console.log(error.massage);
  }
};

export const createPenjualantb = async (req, res) => {
  try {
    const resAPI = await Penjualantb.create({
      namaPelanggan: req.body.namaPelanggan,
      tanggalTransaction: req.body.tanggalTransaction,
    });

    res.status(201).json(resAPI);
  } catch (error) {
    console.log(error.massage);
  }
};
