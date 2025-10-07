import { PrismaClient } from '../generated/prisma/index.js'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export async function tokenVerification(req, res, next) {
    //retrieves the entire value of the Authorization header, which would look something like this: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     const authHeader = req.headers['authorization']
     const token = authHeader && authHeader.split(' ')[1]//splits at space and takes the second part
     console.log(token)
     if(!token){ return res.status(404).json({error: "Token Not Found"})}
     jwt.verify(token, process.env.Auth_Key, function(err, decoded) {
        if (err) {
            console.log(err)
            return res.status(401).json({msg: err.message || 'Invalid Token'})
         }

         //the payload during token gen was userid, now we can attach it to the req so that we can identify which session to delete
         req.userid = decoded.id
         //session table has id as prim key and token as unique so it needs one of those two in the condition to delete
         req.token = token
         next()
        })
}





export function reqValidator(req, res, next) {
    try{
        const { email, password, username } = req.body
        if(!validator.isEmail(email))//validator built-in function complies with RMC smth email format
         {
              return res.status(400).json({ error: "Invalid email format" })
         }
        else if(validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(username)) {
             return res.status(400).json({error : "You must input all fields"})
 
         }
         else if(!validator.isStrongPassword(password))
         {
               return res.status(400).json({error : "Use a stronger password"})
         }
         else{
              console.log('Request Verified')
              next()
             }

        }catch(err) {
            console.log(err)
            return res.status(500).json({ error: err.message || "Internal Server Error"})
        }
    
}
