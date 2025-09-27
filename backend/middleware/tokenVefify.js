import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 
    console.log(token)
    if(!token) { return res.status(401).json({ message: 'No token provided' })}
    try{
        const decoded = jwt.verify(token, process.env.Auth_Key)
        req.userId = decoded.userId
        console.log(decoded.userId)
        next()
    }   
    catch(err){
        console.log(err)
        return res.status(403).json({ message: 'Invalid token' })
    }
}