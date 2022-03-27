import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/error";
// import { ObjectSchema } from "@types/yup";

export default (yupSchema: any,strict: boolean = true, options?: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (process.env.DEBUG)
            console.log({
                yupSchema,
                requestBody: req.body.body ? req.body.body : req.body,
                query: req.query,
                params: req.params
            })
       try {
           await yupSchema.validate({
                requestBody: req.body.body ? req.body.body : req.body,
                query: req.query,
                params: req.params
           }, { abortEarly: false, strict })
       } catch (err: any) {
           throw new ErrorHandler(403,"Validation error",err.errors || [1])
       }
        next()
    }
}