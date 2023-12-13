// const express = require("express");
// const router = express.Router();
// const AdvertisementService = require("../repositories/AdvertisementRepository");

// // Define your routes here
import express from "express";
const router = express.Router();
import AdvertisementService from "../services/AdvertisementService.js";

router.get("/", async (req, res) => {
  const service = new AdvertisementService();
  const list = await service.getAllLocations();
  res.send(list);
});

router.get("/locations", (req, res) => {
  res.send("This is location");
});

export default router;
