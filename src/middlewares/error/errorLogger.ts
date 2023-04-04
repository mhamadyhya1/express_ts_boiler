import { NextFunction, Request, Response } from "express"

export const errorLogger = (
    error: Error, 
    request: Request, 
    response: Response, 
    next: NextFunction) => {
      console.log( `error ${error.message}`) 
      next(error) // calling next middleware
}