import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '../config/db.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

sequelize.sync()
    .then(() => console.log("✅ Database synced successfully"))
    .catch(err => console.error("❌ Database sync error:", err));

app.use('/api/auth', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
