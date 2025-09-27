import { Server } from 'socket.io'
import { PrismaClient } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

let io
const prisma = new PrismaClient()

export async function initializeSocketServer(server) {
     io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
      
    })
    console.log('Socket server initialized...')

    //this runs before the 'connection' event is fired
    //this way we get the id of each user when they connect and can authenticate them
    io.use(async (socket, next) => {    
        //on the flutter fronted we need to setQuery the token of the specific user 
        const token = socket.handshake.query.token
        if(!token){ return next(new Error('Authentication error: No token provided'))}
        try{
            //we can do this cuz we used the user id as the payload while generating the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.userId = decoded.id
            next()
        }
        catch(err){ 
            console.log(err)
            return next(new Error('Authentication error: Invalid token'))
        }
    })

    io.on('connection', (client) => {
      console.log(`Client connected: ${client.userId}`)
      //joins a room named after the user ID
      //when an event is triggered 
      //and we want to emit to specific users only, we can emit to rooms named after those specific user IDs
      //this way only those users will receive the event
      client.join(client.userId)

      client.on('disconnect', () => {
        console.log(`Client disconnected: ${client.userId}`)
      })
    })

    io.on('locationUpdate', (data) => {
      console.log('Location update received:', data)
    })

    io.on('requestStatusUpdate', (data) => {
      console.log('Request status update received:', data)
    })
}

export function getIOInstance(server) {
  if(!io){ return 'no server'}
  return io
}
