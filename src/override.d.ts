// Extend the Express namespace to include custom properties
declare namespace Express {
    export interface Request {
        userId: string; // Extend Express Request to include userId for authentication
    }
}