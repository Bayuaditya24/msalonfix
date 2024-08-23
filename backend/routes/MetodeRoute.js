import express from "express";
import {
  getMetode,
  getMetodeById,
  createMetode,
} from "../controller/MetodeController.js";

const router = express.Router();

router.get("/metode", getMetode);
router.get("/metode/:id", getMetodeById);
router.post("/metode", createMetode);

export default router;
