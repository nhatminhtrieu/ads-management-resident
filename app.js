import express from "express";
import cors from "cors";
import Connection from "./database/Connection.js";
import AdvertisementRouter from "./routes/advertisementRoutes.js";

const app = express();
const port = 3456;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is homepage");
});

app.use("/advertisement", AdvertisementRouter);

app.use("/static", express.static("static"));

app.listen(port, () => {
  console.log(`Example app listening on localhost:${port}`);
});

app.post("/verify-captcha", async (req, res) => {
  const token = req.body.token
  const SECRET_KEY = "0x4AAAAAAAOLF_VMQOt4VdwLdjlleq29sVY"
  let formData = new FormData();
  let userIP = null;

  await fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => userIP = data.ip)
    .catch(error => console.error("Error on getting users' IP:", error));

  formData.append('secret', SECRET_KEY);
  formData.append('response', token);
  formData.append('remoteip', userIP);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const result = await fetch(url, {
    body: formData,
    method: 'POST',
  });

  console.log("IP: ", userIP)
  const outcome = await result.json();
  
  return res.json(outcome)
})

Connection();
