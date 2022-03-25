import { Response } from "express"

export class ErrorHandler extends Error {
  code: number;
  message: string;
  errors: string[];
  
  constructor(code: number, message: string, errors: string[] = []) {
    super();
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
  static get404 = (type: string) => {
    return new ErrorHandler(404, `${type} not found`);
  };
}

type Payload = {
  status: string;
  code: number;
  message: string;
  errors: string[] | undefined;
}

export const handleError = (err: ErrorHandler, res: Response) => {
  if (err.message !== "Internal error") console.log(err, 12333);
  const { code, message, errors } = err;
  let payload: Payload = {
    status: "error",
    code,
    message,
    errors: undefined
  };
  if (errors && errors.length) payload.errors = errors
  return res.status(code || 500).json(payload);
};