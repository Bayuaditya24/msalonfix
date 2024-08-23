import express from "express";
import {
  createPerawatantb,
  getPerawatantb,
  getPerawatantbById,
} from "../controller/PerawatanController.js";
import { getPerawatanByCategory } from "../controller/PerawatanController.js";

const router = express.Router();

router.get("/perawatan", getPerawatantb);
router.get("/perawatan/:id", getPerawatantbById);
router.post("/perawatan", createPerawatantb);
router.get("/perawatan/category/:categoryId", getPerawatanByCategory);

export default router;
