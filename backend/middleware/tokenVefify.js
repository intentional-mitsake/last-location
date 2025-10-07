import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { isTokenRevoked } from '../services/revokeToken.js'
dotenv.config()

export async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 
    console.log(token)
    if(!token) { return res.status(401).json({ message: 'No token provided' })}
    try{
        //using verify automatically checks the expiry as welll
        const decoded = jwt.verify(token, process.env.Auth_Key)
        req.userId = decoded.userId
        console.log(decoded.userId)
        //we check if this token is in the black list
        const revoked = await isTokenRevoked(token)
        if(!revoked){
            //acces given if valid token
            req.token = token
            next()
        }
        else{
            return res.status(401).json({message: 'Token not valid'})
        }
        
    }   
    catch(err){
        //jwt.verify calls this error if expired
        if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
    }
        console.log(err)
        return res.status(403).json({ message: 'Invalid token' })
    }
}