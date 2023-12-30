import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    

    if (!token) return next(errorHandler(401, "You are not Authorized"))
    
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return errorHandler(403, "Forbidden")

        // if not error we set the user in cookie to the body
        req.user = user
        // next function in user.route.js
        next()
    })
    
}