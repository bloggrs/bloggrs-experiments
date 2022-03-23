import { ErrorHandler, handleError } from "../utils/error";
import { Request, Response, NextFunction } from "express";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    const error: Error | ErrorHandler = err;
    
    if (process.env.DEBUG) console.table(err)

    if (err instanceof ErrorHandler) return handleError(err, res);
    else if (err.errors) {
        const validationError = new ErrorHandler(403, "ValidationError", err.errors.map((err: any) => err.message))
        return handleError(validationError, res);
    }
    else if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: "error",
            message:"Unauthorized",
            code: 401,
        })
    } else {
        if (process.env.DEVELOPMENT) throw err;
        else return res.status(500).json()
    }
}