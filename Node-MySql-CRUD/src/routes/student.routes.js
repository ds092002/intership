const express = require('express');
const { 
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudentById,
    deleteStudentById
} = require('../controllers/student.controller');

const router = express.Router();

// Get all student list 
router.get('/getall',getAllStudents)
// Get student by id
router.get('/get/:id', getStudentById)
// Create student
router.post('/create', createStudent)
// Update student by id
router.put('/update/:id', updateStudentById)
// Delete student by id
router.delete('/delete/:id', deleteStudentById)

module.exports = router