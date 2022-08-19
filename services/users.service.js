require('../database/dbConfig');
const adminModel = require('../model/admin');
const teacherModel = require('../model/teacher');
const studentModel = require('../model/student');
const notificationModel = require('../model/notification');
const jwt = require('jsonwebtoken');
const mailer = require('../helper/mailer');
const teacher = require('../model/teacher');


generateAuthToken = async (id) => {
    try {
        const token = jwt.sign({ _id: id }, "ayushguptahestabitayushguptahestabit");
        return token;
    } catch (error) {
        console.log(error);
    }
}

checkAuthAdmin = async (id) => {
    try {
        const user = await adminModel.findById(id);
        if ([user].length) {
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = {

    // Define service name
    name: "users",

    actions: {
        // Define service action that returns the available products
        async login(req, res) {
            const response = await adminModel.find(req.params);
            if (response.length) {
                const token = await generateAuthToken(response._id);
                return {
                    'success': true,
                    'data': response,
                    'token': token
                }
            } else {
                const response = await teacherModel.find(req.params);
                if (response.length) {
                    const token = await generateAuthToken(response._id);
                    return {
                        'success': true,
                        'data': response,
                        'token': token
                    }
                } else {
                    const response = await studentModel.find(req.params);
                    if (response.length) {
                        const token = await generateAuthToken(response._id);
                        return {
                            'success': true,
                            'data': response,
                            'token': token
                        }
                    } else {
                        return {
                            'success': false,
                            'message': "Invalid Credentials..!"
                        }
                    }
                }
            }
        },
        async register(req) {
            const role = req.params.role;
            if (role) {
                const admin = await adminModel.findOne({});
                if (role === "Teacher") {
                    const user = new teacherModel(req.params);
                    const token = await generateAuthToken(user._id);
                    try {
                        user.save()
                        const notification = new notificationModel({
                            title: "New Registration",
                            body: "There's a new registration with name " + user.name,
                            userId: admin._id
                        })
                        notification.save()
                        return {
                            'success': true,
                            'data': user,
                            'token': token
                        }
                    }
                    catch (err) {
                        return err;
                    }
                }
                if (role === "Student") {
                    const user = new studentModel(req.params);
                    const token = await generateAuthToken(user._id);
                    try {
                        user.save()
                        const notification = new notificationModel({
                            title: "New Registration",
                            body: "There's a new registration with name " + user.name,
                            userId: admin._id
                        })
                        notification.save()
                        return {
                            'success': true,
                            'data': user,
                            'token': token
                        }
                    }
                    catch (err) {
                        return err;
                    }
                }
            } else {
                return {
                    'success': false,
                    'message': "No Role Defined"
                }
            }
        },
        async approveTeacher(req) {
            const check = await checkAuthAdmin(req.params.user);
            if (check) {
                const user = await teacherModel.findByIdAndUpdate(req.params.teacherId, {
                    isApproved: req.params.isApproved
                },
                    {
                        new: true,
                        useValidation: true,
                        useFindAndModify: false
                    }
                )
                await user.save();
                const notification = new notificationModel({
                    title: "Profile Approval",
                    body: "Your Profile is successfully approved",
                    userId: user._id
                });
                await notification.save();
                mailer(user.email.toString(), "Your Profile has been Approved Successfully..!")
                return {
                    success: true,
                    user
                }
            } else {
                return {
                    "success": false,
                    "message": "You are not authorised..!"
                }
            }
        },
        async approveStudent(req) {
            const check = await checkAuthAdmin(req.params.user);
            if (check) {
                const user = await studentModel.findByIdAndUpdate(req.params.studentId, {
                    isApproved: req.params.isApproved
                },
                    {
                        new: true,
                        useValidation: true,
                        useFindAndModify: false
                    }
                )
                await user.save();
                const notification = new notificationModel({
                    title: "Profile Approval",
                    body: "Your Profile is successfully approved",
                    userId: user._id
                });
                await notification.save();
                mailer(user.email.toString(), "Your Profile has been Approved Successfully..!")
                return {
                    success: true,
                    user
                }
            } else {
                return {
                    "success": false,
                    "message": "You are not authorised..!"
                }
            }
        },
        async assignTeacher(req) {
            const check = await checkAuthAdmin(req.params.user);
            if (check) {
                const teacher = await teacherModel.find({ _id: req.params.teacherId });
                if ([teacher].length) {
                    const user = await studentModel.findByIdAndUpdate(req.params.studentId, {
                        teacher_id: req.params.teacherId
                    },
                        {
                            new: true,
                            useValidation: true,
                            useFindAndModify: false
                        })
                    await user.save();
                    mailer(user.email.toString(), "A teacher has been assigned to you..!");
                    const notification = new notificationModel({
                        title: "Assigned Teacher",
                        body: teacher[0].name + " is assigned as your Teacher",
                        userId: req.params.studentId
                    });
                    await notification.save();
                    return {
                        success: true,
                        user
                    }
                } else {
                    return {
                        "success": false,
                        "message": "Wrong Teacher ID..!"
                    }
                }
            } else {
                return {
                    "success": false,
                    "message": "You are not authorised..!"
                }
            }
        },
        async updateDataTeacher(req) {
            const user = await teacherModel.findByIdAndUpdate(req.params.id, req.params, {
                new: true,
                useValidation: true,
                useFindAndModify: false
            })
            await user.save();
            return {
                success: true,
                user
            }
        },
        async updateDataStudent(req) {
            const user = await studentModel.findByIdAndUpdate(req.params.id, req.params, {
                new: true,
                useValidation: true,
                useFindAndModify: false
            })
            await user.save();
            return {
                success: true,
                user
            }
        },
        async newTeachers() {
            const teachers = await teacherModel.find({ isApproved: false });
            if (teachers.length) {
                return {
                    success: true,
                    user: teachers
                }
            } else {
                return {
                    success: false,
                    message: "No Users Found...!"
                }
            }
        },
        async newStudents() {
            const students = await studentModel.find({ isApproved: false });
            if (students.length) {
                return {
                    success: true,
                    user: students
                }
            } else {
                return {
                    success: false,
                    message: "No Users Found...!"
                }
            }
        },
    }
}