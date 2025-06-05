import { Router } from "express";
import { startOTP, verifyOTP, getVerficationStatus, authenticateToken } from "../controllers/auth.controller.js";

const auth_routes = Router()

auth_routes.post('/send-otp', startOTP)
auth_routes.post('/verify-otp', verifyOTP)
auth_routes.get('/verify-status', authenticateToken, getVerficationStatus)

auth_routes.get('/test', authenticateToken, (req, res) => {
    res.json({ message: 'Access granted', user: req.user });
})

export { auth_routes }