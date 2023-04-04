import { NextFunction, Request, Response } from "express"
export const invalidPathHandler = (
    request: Request, 
    response: Response, 
    next: NextFunction) => {
      response.status(404)
      response.send('invalid path')
  }