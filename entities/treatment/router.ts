import express from "express";
import { listTreatments, createTreatment, deleteTreatment } from "./controller.js";
import { auth } from "../../core/middleware.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.json(await listTreatments());
  } catch (e) {
    next(e);
  }
});

router.post("/",  async (req, res, next) => {
  try {
    res.json(await createTreatment(req));
  } catch (e) {
    next(e);
  }
});

router.delete("/:id",  async (req, res, next) => {
  try {
    res.json(await deleteTreatment(req));
  } catch (e) {
    next(e);
  }
});

export default router;
