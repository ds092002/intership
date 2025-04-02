const db = require('../config/db');

// Service to get all students
const getAllStudents = async () => {
    const query = 'SELECT * FROM students';
    const [rows] = await db.execute(query);
    return rows;
};

// Service to get a student by ID
const getStudentById = async (id) => {
    const query = 'SELECT * FROM students WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};

// Service to create a new student
const createStudent = async (studentData) => {
    const query = 'INSERT INTO students (name, age, grade) VALUES (?, ?, ?)';
    const { name, age, grade } = studentData;
    const [result] = await db.execute(query, [name, age, grade]);
    return result.insertId;
};

// Service to update a student by ID
const updateStudent = async (id, studentData) => {
    const query = 'UPDATE students SET name = ?, age = ?, grade = ? WHERE id = ?';
    const { name, age, grade } = studentData;
    const [result] = await db.execute(query, [name, age, grade, id]);
    return result.affectedRows > 0;
};

// Service to delete a student by ID
const deleteStudent = async (id) => {
    const query = 'DELETE FROM students WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};