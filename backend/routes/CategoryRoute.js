import express from "express";
import {
  getCategory,
  getCategoryById,
  createCategory,
} from "../controller/CategoryController.js";

const router = express.Router();

router.get("/category", getCategory);
router.get("/category/:id", getCategoryById);
router.post("/category", createCategory);

export default router;
