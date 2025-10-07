import { createClient } from 'redis'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const client = createClient({ url: process.env.Redis_URL })

client.on('error', (err) => console.log('Redis Client Error', err))

await client.connect()

export async function revokeToken(token) {
    try {
        const decoded = jwt.decode(token)
        if(!decoded) { throw new Error('Invalid token')}
        //date.now gives milliseconds
        //expiry is in seconds
        //math.floor + /1000 to convert to approx seconds
        const expiry = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600 // default 1 hour if no exp claim
        //we cant store all the tokens forever so we delete them if expiry is reached
        await client.set(
            `${process.env.Blacklisted_Prefix}${token}`, 
            'true', 
            { 
                NX: true,
                EX: expiry 
            }
        )
        console.log(`Token revoked: ${token}`)
    } catch (error) {
        console.error('Error revoking token:', error)
    }
}

export async function isTokenRevoked(token) {
    if (!client.isReady) {
        console.warn('Redis not connected. Denying access as a safety measure.')
        return true
    }
    try {
        const result = await client.get(`${process.env.Blacklisted_Prefix}${token}`)
        return result !== null
    } catch (error) {
        console.error('Error checking token revocation:', error)
        return false
    }
}

process.on('exit', () => {
    client.quit()
})

