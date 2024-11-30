import mongoose from "mongoose";

const employeeSchema = mongoose.Schema({
    empName:{
        type: String,
        required:[true, "Employee Name is required"],
        minLength: [3, "Name must contain at least 3 characters!"],
    },
    email: {
        type: String,
        required:[true, "Email of Employee is required"]
    },
    photo: {
        public_id: String,
        url: String,
    },
    phoneNo:{
        type: String,
        required:[true, "Contact No. of Employee is required"],
        minLength: [10, "Length is less than Indian Standard Length"],
        maxLength: [10, "Length is greater than Indian Stanadard Length"],
    },
    doj:{
        type: Date,
        required: [true, "Date of Joining is required!"],
        default: Date.now
    },
    salary:{
        type: Number,
        required: [true, "Salary Required!"]
    },
    outStandSalary:{
        type: Number,
        default: 0
    }
});

export const Employee = mongoose.model("employee", employeeSchema);