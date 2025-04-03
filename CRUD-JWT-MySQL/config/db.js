import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE}`);
        console.log(`✅ Database '${process.env.DATABASE}' checked/created.`);
    } catch (error) {
        console.error("❌ Database creation error:", error);
    }
};

await createDatabase();

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: "mysql",
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => console.log("✅ Database connected..."))
    .catch(err => console.error("❌ Database connection error:", err));

export default sequelize;
