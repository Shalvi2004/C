import { User } from '../modals/user.modal.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Common cookie options for security and consistency
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    sameSite: 'strict' 
};

export const registerUser = async (req, res) => {
    try {
        const body = req.body || {};
        const userName = body.userName ?? body.name ?? '';
        const email = body.email ?? '';
        const password = body.password ?? '';

        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }

        const existing = await User.findOne({ email: email.trim().toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const user = new User({ userName: userName.trim(), email: email.trim().toLowerCase(), password });
        const saved = await user.save();
        
        const { _id } = saved;
        const userToken = jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        // FIX: Use res.cookie() with secure options
        res.cookie('token', userToken, cookieOptions);

        // FIX: Removed 'token' from the response body
        return res.status(201).json({
            message: 'User Registered Successfully',
            user: { id: _id, name: saved.userName, email: saved.email }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const body = req.body || {};
        const email = body.email ?? '';
        const password = body.password ?? '';

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }

        const { _id, userName } = user;
        const userToken = jwt.sign({ id: _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', userToken, cookieOptions); 

        return res.status(200).json({
            message: 'Login Successful',
            user: { id: _id, name: userName, email: user.email }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutUser = (req, res) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
    return res.status(200).json({ message: 'Logout Successful' });
};