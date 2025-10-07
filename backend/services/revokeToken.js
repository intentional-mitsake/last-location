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
                //this makes sure it is deleted when the expiry time comes
                EX: expiry 
            }
        )
        console.log(`Token revoked: ${token}`)
    } catch (error) {
        console.error('Error revoking token:', error)
    }
}

export async function isTokenRevoked(token) {
    //so apparently this is a neccessary check which saves us from some errors
    if (!client.isReady) {
        console.warn('Redis not connected. Denying access as a safety measure.')
        return true
    }
    try {
        const result = await client.get(`${process.env.Blacklisted_Prefix}${token}`)
        //returns true or false baseed on the given condition
        //if the token is revoked then we will get the data and it will be true .i.e the the token is revoked
        //if it was expired the verify used in the verification will deal with it
        //if its not revoked this willl be null and so false
        return result !== null
    } catch (error) {
        console.error('Error checking token revocation:', error)
        return false
    }
}

process.on('exit', () => {
    client.quit()
})

