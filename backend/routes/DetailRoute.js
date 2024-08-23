import express from "express";
import {
  getDetail,
  getDetailById,
  createDetail,
  updateDetail,
} from "../controller/DetailController.js";

const router = express.Router();

router.get("/detail", getDetail);
router.get("/detail/:id", getDetailById);
router.post("/detail", createDetail);
router.put("/detail/:id", updateDetail);

export default router;
