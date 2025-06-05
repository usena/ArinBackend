import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, enum: ['user', 'admin']},
    
    verification: {
        isVerified: { type: Boolean, default: false },
        otpCode: { type: String },
        otpExpire: { type: Date }
    }
});

const User = mongoose.model('Users', UserSchema); // Goes into 'users' collection in 'my_app_db'

export { User }