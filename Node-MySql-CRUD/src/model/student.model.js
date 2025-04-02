const {DataTypes, Model} = require("sequelize");
const sequelize = require("../../config/db");

class Student extends Model {}

Student.init({
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    roll_no:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    fees:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    medium:{
        type: DataTypes.STRING,
        allowNull: false,
    }
},
{
    sequelize,
    modelName: "student",
    tableName: "student",
    timestamps: true,
});

module.exports = Student;