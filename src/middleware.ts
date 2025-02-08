import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

const userMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Get the JWT token from the request headers
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(403).json({ msg: 'No token provided' });
        return;
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(authHeader, JWT_SECRET) as { id: string };
        // Attach the decoded user (information) to the request object
        req.userId = decoded.id;
        next();
    } catch (e) {
        res.status(403).json({ msg: 'Invalid token' });
        return;
    }
};

export default userMiddleware;
