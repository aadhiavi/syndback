const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeId: String,
    designation: String,
    doj: Date,
    firstName: String,
    lastName: String,
    gender: String,
    dob: Date,
    mobile: String,
    email: String,
    pan: String,
    aadhaar: String,
    bloodGroup: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    bankName: String,
    branch: String,
    accountNo: String,
    ifscCode: String,
    kinName: String,
    relationship: String,
    kinAddress: String,
    kinPhone: String,
    employeeSignature: String
});

module.exports = mongoose.model('Employee', EmployeeSchema);
