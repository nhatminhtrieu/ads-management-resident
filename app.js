import express from 'express';
import Connection from './database/Connection.js';

const app = express()
const port = 3456

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/static', express.static('static'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

Connection();