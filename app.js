import express from "express";
import Connection from "./database/Connection.js";
import AdvertisementService from "./services/AdvertisementService.js";
import AdvertisementRouter from "./routes/advertisementRoutes.js";

const app = express();
const port = 3456;

app.get("/", (req, res) => {
  const list = new AdvertisementService().getAllLocations();
  res.send(list);
});

app.use("/advertisement", AdvertisementRouter);

app.use("/static", express.static("static"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
Connection();
