import { DataTypes } from 'sequelize';
import sequelize from '../../config/db.js';

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    timestamps: false,
});

sequelize.sync()
    .then(() => console.log("✅ User table created successfully"))
    .catch(err => console.error("❌ User table creation error:", err));

export default User;
