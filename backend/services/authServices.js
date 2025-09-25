import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../generated/prisma/index.js'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

export async function registration(email, password, username) {
    try{
        const hpw = await bcrypt.hash(password, 10)
        const created = new Date(Date.now())
        const newUser = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hpw
            }
        })
        if(!process.env.Auth_Key) { throw new ErrorI("JWT KEY not set in enviroment variables")}
        //main idea here is to create two tokens one with short expiry for access and one with long expiry for refresh so that user does not have to login again and again
        //whenever access token expires, frontend can use the refresh token to get a new access token without asking user to login again
        //this refresh token can be stored in httpOnly cookie so that it is not accessible via JS and is sent automatically with every request to backend
        const accessToken = jwt.sign({ id: newUser.id }, process.env.AUTH_KEY, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: newUser.id }, process.env.REFRESH_KEY, { expiresIn: '30d' })
        await prisma.log.create({ data: { userId: newUser.id, message: 'New user registered and logged in.' } })

        return { accessToken, refreshToken } 

    }catch(err)
    {
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}

export async function login(user, password) {
    try{
        const match = await bcrypt.compare(password, user.password)//it hashes the pw user provides and compares wiht the hashed pw from DB. Returns true or false
        if(match) { 
                if(!process.env.Auth_Key) { throw new Error("JWT KEY not set in enviroment variables")}
                const accessToken = jwt.sign({ id: newUser.id }, process.env.AUTH_KEY, { expiresIn: '15m' });
                const refreshToken = jwt.sign({ id: newUser.id }, process.env.REFRESH_KEY, { expiresIn: '30d' })
                await prisma.log.create({ data: { userId: newUser.id, message: 'User logged in.' } })
                console.log("User Logged In")
                return { accessToken, refreshToken  }
               
            }
        else{
            throw new Error(" Password Incorrect")
        }
    }catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}

export async function logout(req, res) {
    try{
        const userid = req.userid
        const token = req.token
        await prisma.log.update({where: {userId: userid}, data: { userId: userid, message: 'User logged out.' } })
        console.log("User Logged Out")
        return res.status(200).json({msg: "User Logged Out"})
    }catch(err){
        console.log(err)
        return res.status(500).json(err.message || 'Internal Server Error')
    }
    
}
