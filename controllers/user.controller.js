import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import dotenv from 'dotenv'

import { User } from '../models/user.model.js'

dotenv.config()

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        if ( !username || !email || !password ){
            res.status(400).json({ message: "Credentials incomplete" })
        }
        const hash_pass = await bcrypt.hash(password, 10)
        const newUser = await User.create({ username, email, password: hash_pass })
        const token = jsonwebtoken.sign(
            { userId: newUser._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.status(201).json({ message: "User registered successfully", token: token })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const userLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body
        const user = await User.findOne({
            $or: [
                {username: identifier},
                {email : identifier}
            ]
        })
        console.log(password)
        console.log(user.password)

        if ( !user || !bcrypt.compare(password, user.password) ) {
            return res.status(400).json({ message: `Invalid credentials` })
        }

        const token = jsonwebtoken.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        
        res.status(201).json(token)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
}