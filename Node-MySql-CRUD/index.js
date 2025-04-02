const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const app = express();
app.use(express.json());
app.use(morgan('dev'));
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');

dotenv.config()

const port = process.env.PORT || 3030;

app.use('/api/v1/student', require('./src/routes/student.routes'));
app.get('/test', (req, res) => {
    res.status(200).send('<h1 style="color:yellow ">Test</h1>');
})

mySqlPool
.query('SELECT 1')
.then(() => {
    console.log('MySQL DB connected'.bgCyan.bold);
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`.bgMagenta.italic);
    })
})
.catch((error) => {
    console.error('Error connecting to MySQL DB:', error.message.red);
});
