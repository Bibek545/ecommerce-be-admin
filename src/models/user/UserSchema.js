import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: 1
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        required: true
    },
    image: {
        type: String,
        
    },
    token: {
        type: String,


    },

    isVerified: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
})

export default mongoose.model("User" ,userSchema); 