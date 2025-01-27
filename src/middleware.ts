import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from './config';


const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get the JWT token from the request headers
    const headers = req.headers.authorization;

    if (!headers) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify the JWT token
        const decoded = jwt.verify(headers , JWT_SECRET) as JwtPayload ;
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        // Attach the decoded user information to the request object
        req.userId = decoded.id ;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default userMiddleware;
