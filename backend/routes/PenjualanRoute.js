import express from "express";
import {
  createPenjualantb,
  getPenjualantb,
  getPenjualantbById,
} from "../controller/PenjualanController.js";

const router = express.Router();

router.get("/penjualan", getPenjualantb);
router.get("/penjualan/:id", getPenjualantbById);
router.post("/penjualan", createPenjualantb);

export default router;
