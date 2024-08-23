import express from "express";
import {
  getPelanggan,
  getPelangganById,
  createPelanggan,
} from "../controller/PelangganController.js";

const router = express.Router();

router.get("/pelanggan", getPelanggan);
router.get("/pelanggan/:id", getPelangganById);
router.post("/pelanggan", createPelanggan);

export default router;
