import express from "express";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import Connection from "./database/Connection.js";
import AdvertisementRouter from "./routes/advertisementRoutes.js";
import VerifyCaptchaRouter from "./routes/verifyCaptchaRoutes.js";
import ImageRouter from "./routes/imageRoutes.js";
import ReportRouter from "./routes/reportRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/static", express.static("static"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/static/index.html");
});

app.use("/advertisement", AdvertisementRouter);

app.use("/verify-captcha", VerifyCaptchaRouter);

app.use("/image", ImageRouter);

app.use("/report", ReportRouter);

app.listen(PORT, () => {
	console.log(`Example app listening on http://127.0.0.1:${PORT}`);
});

Connection();
