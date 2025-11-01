import jwt from 'jsonwebtoken';

export const isUserAuthenticated = (req, res, next) => {
    // Accept token from cookie (supporting both 'userToken' and legacy 'token') or Authorization header (Bearer)
    const cookieToken = req.cookies && (req.cookies.userToken || req.cookies.token);
    const authHeader = req.headers && req.headers.authorization;
    let bearerToken = null;
    if (authHeader && typeof authHeader === 'string') {
        // case-insensitive check and robust splitting (handles extra spaces)
        const [scheme, credentials] = authHeader.trim().split(/\s+/);
        if (scheme && credentials && scheme.toLowerCase() === 'bearer') {
            bearerToken = credentials;
        }
    }
    const token = cookieToken || bearerToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        // Fail closed: don't allow authentication when secret is not configured
        console.error('JWT_SECRET is not set in environment');
        return res.status(500).json({ message: 'Server misconfiguration' });
    }

    try {
        const decoded = jwt.verify(token, secret);
        // Attach minimal decoded user info to request, avoid attaching sensitive fields
        req.user = {
            id: decoded.id || decoded.userId || null,
            email: decoded.email || null,
        };
        return next();
    } catch (err) {
        console.warn('Invalid auth token:', err.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};