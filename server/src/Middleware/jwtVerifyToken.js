const { verify } = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

const jwtVerifyToken = (allowedRoles) => {
    return (req, res, next) => {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ message: 'Token Missing' });
        }

        const accessToken = authorization.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({ message: 'Token format invalid' });
        }

        try {
            const decoded = verify(accessToken, JWT_SECRET);

            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid Token' });
        }
    };
};

module.exports = jwtVerifyToken;