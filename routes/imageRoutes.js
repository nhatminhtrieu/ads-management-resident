// Define your routes here
import express from "express";
const router = express.Router();
import ImageService from "../services/ImageService.js";

router.get("/", async (req, res) => {
  const service = new ImageService();
  const id = req.query.id;
  const image = await service.getImageById(id);
  res.send(image);
});

router.post("/create", async (req, res) => {
  const service = new ImageService();
  const image = await service.createImage(req.body);
  res.send(image._id);
});

export default router;
