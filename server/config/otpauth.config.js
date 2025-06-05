import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PSSWD,
    },
    tls: {
        rejectUnauthorized: false
    }
})

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
} 

async function sendOTP(email, otp) {
    await transporter.sendMail({
        from: '"Citilink Helpdesk Admi" <citilinkhd@gmail.com>',
        to: email,
        subject: 'Citilink Helpdesk Account Verification',
        text: `Your verification code is ${otp} - This code will be valid for 10 minutes`
    })
}

export { generateOTP, sendOTP }