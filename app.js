import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import VerifyCaptchaRouter from "./routes/verifyCaptchaRoutes.js";

config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use("/static", express.static("static"));

app.get("/", (req, res) => {
	res.redirect("/static");
});

app.use("/verify-captcha", VerifyCaptchaRouter);

// SSL and HTTPS configuration
import fs from "fs";
import https from "https";

const privateKey = fs.readFileSync("./sslcert/private.key", "utf8");
const certificate = fs.readFileSync("./sslcert/certificate.crt", "utf8");
const ca = fs.readFileSync("./sslcert/ca_bundle.crt", "utf8");

const credentials = { key: privateKey, cert: certificate, ca: ca };
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
	console.log(`App is running on https://127.0.0.1:${port}`);
});