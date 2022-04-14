import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
  const authToken = request.headers.authorization

  if(!authToken) {
    return response.status(401).json({ 
      errorCode: "token.invalid"
    })
  }

  const [,token] = authToken.split(" ") //remove 'Bearer ' from authToken

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as IPayload //verify if token is valid
    
    request.user_id = sub
    
    return next()
  } catch (error) {
    return response.status(401).json({ errorCode: "token.expired" })
  }

}