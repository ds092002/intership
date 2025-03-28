const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoutes = require('./routes/index.routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', userRoutes);

app.listen(port, async () => {
    mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log('DB Connected Successfully..'))
    .catch((error) => console.log('Error in DB Connection:', error.message));
    console.log(`Server Start At http://localhost:${port}`);
    
})