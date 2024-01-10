import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
    const token = req.body.token
    const SECRET_KEY = "0x4AAAAAAAOLF_VMQOt4VdwLdjlleq29sVY"
    let formData = new FormData();
    const userIP = req.socket.remoteAddress;
    
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);
    formData.append('remoteip', userIP);

    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = await fetch(url, {
        body: formData,
        method: 'POST',
    });

    const outcome = await result.json();
    return res.json(outcome)
})

export default router;