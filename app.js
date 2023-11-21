import express from 'express';

const app = express()
const port = 21127

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/static', express.static('static'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})