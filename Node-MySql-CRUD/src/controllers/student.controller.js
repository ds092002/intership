const Student = require("../model/student.model");

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        if(!students.length){
            return res.status(404).json({
                success: false,
                message: 'No student found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'All students',
            students
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
             success: false, 
             message: "Internal server error", 
             error: error.message 
        });
    }
};

// Get student by id
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student id is required'
            });
        }
        res.status(200).json({
            success: true,
            message: "student details",
            studentDetail: student
        })
    } catch (error) {
        console.log(error.message.red);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Create student
exports.createStudent = async (req, res) => {
    try {
        const { name, roll_no, medium, fees } = req.body;
        if (!name || !roll_no || !medium || !fees) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        const student = await Student.create({
            name,
            roll_no,
            medium,
            fees
        });
        res.status(201).json({
            success: true,
            message: `Student created successfully`,
            student: student
        })
    } catch (error) {
        console.log(error.message.red);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
    }
};

// Update student by id
exports.updateStudentById = async (req, res) => {
    try {
       const studentId = await Student.findByPk(req.params.id);
       if(!studentId){
        return res.status(404).json({
            success: false,
            message: 'Student not found'
        })
       }
       await studentId.update(req.body);
       res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            studentDetail: {
                id: studentId.id,
                name: studentId.name,
                roll_no: studentId.roll_no,
                medium: studentId.medium,
                fees: studentId.fees
            }
       })
    } catch (error) {
        console.log(error.message.red);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Delete student by id
exports.deleteStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            })
        }
        await student.destroy();
        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',

        });
    } catch (error) {
        console.log(error.message.red);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        })
        
    }
}