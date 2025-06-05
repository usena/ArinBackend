import jsonwebtoken from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { generateOTP, sendOTP } from '../config/otpauth.config.js';

const otp_lifetime = 10 * 60 * 1000

export const startOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        const expires = new Date(Date.now() + otp_lifetime); // 10 minutes from now

        await User.findOneAndUpdate(
            { email: email },
            { 
                $set: { 
                    "verification.otpCode" : otp,
                    "verification.otpExpire" : expires,
                }
            },
            { new: true }
        );
        await sendOTP(email, otp);

        res.status(201).json({ message: 'OTP sent to your email' });
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (user && user.verification) {

            if (user.verification.otpCode !== otp || user.verification.otpExpire < new Date()){
                res.status(400).json({ message: "Code invalid or expired" })
            }
            else {
                
                user.verification.isVerified = true;
                user.verification.otpCode = undefined;
                user.verification.otpExpire = undefined;
                await user.save();

                res.status(200).json({ message: 'Email verified successfully' });
            }
        }
        else {
            res.status(500).json({ message: "OTP not set!" })
        }
    }
    catch (err) {

    }
}

export const getVerficationStatus = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ isVerified: user.verification.isVerified });
}

export function authenticateToken(req, res, next) {
    // console.log(req.headers["authorization"])
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'No token' });


    jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Forbidden" }); // Forbidden
        req.user = user; // user = payload from JWT
        console.log(req.user)
        next();
    });
    
}