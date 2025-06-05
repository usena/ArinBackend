import { Router } from "express";
import { getUserData, registerUser, userLogin } from "../controllers/user.controller.js";
import { authenticateToken } from "../controllers/auth.controller.js";

const user_routes = Router()

user_routes.post('/sign-up', registerUser)
user_routes.post('/log-in', userLogin)
user_routes.get('/me', authenticateToken, getUserData)

export { user_routes }