import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import VerifyCaptchaRouter from "./routes/verifyCaptchaRoutes.js";

config();
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

app.use("/verify-captcha", VerifyCaptchaRouter);

app.listen(PORT, () => {
	console.log(`Example app listening on http://127.0.0.1:${PORT}`);
});
