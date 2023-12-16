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

export default router;
