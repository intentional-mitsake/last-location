import { Server } from 'socket.io'

let io

export async function initializeSocketServer(server) {
     io = new Server(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
      
    })
    console.log('Socket server initialized...')
    io.on('connection', (client) => {
      console.log('Client connected...')

      client.on('disconnect', () => {
        console.log('Client disconnected...')
      })
    })
}

export function getIOInstance(server) {
  if(!io){ return 'no server'}
  return io
}
