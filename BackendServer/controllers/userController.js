import { User } from '../modals/user.modal.js';

export const registerUser = async (req, res) => {
    try {
        const body = req.body || {};
        // Accept either `userName` (client) or `name` (server) fields
        const userName = body.userName ?? body.name ?? '';
        const email = body.email ?? '';
        const password = body.password ?? '';

        // Basic validation
        if (!userName || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.trim().toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // Create and save user - password hashing is handled in the model pre-save hook
        const user = new User({ userName: userName.trim(), email: email.trim().toLowerCase(), password });
        const saved = await user.save();

        // Return sanitized user (exclude password)
        const { _id } = saved;
        return res.status(201).json({
            message: 'User Registered Successfully',
            user: { id: _id, userName: saved.userName, email: saved.email },
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};