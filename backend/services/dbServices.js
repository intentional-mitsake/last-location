import { PrismaClient } from "../generated/prisma/index.js"
import { getIOInstance } from "./socketServer.js"

const prisma = new PrismaClient()

export async function getUserLocation(userId) {
    try{
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { sentRequests: true, receivedRequests: true }
        })
        if(!user) { throw new Error("User Not Found")}
        
        //filter function filters out the elements based on the condition provided in the callback function
        //map function creates a new array with the results of the array provided in the callback function
        //here we are filtering out the requests which are accepted and then mapping them to get an array of user ids of those accepted friends
        const acceptedRequests = [...user.sentRequests.filter((element) => element.status === 'ACCEPTED').map((element) => element.recipientId),
                                  ...user.receivedRequests.filter((element) => element.status === 'ACCEPTED').map((element) => element.senderId),]
        const fetchedLocations = await prisma.user.findMany({
            where: { id: { in: acceptedRequests } },
            select: { lastLocation: true }
        })
        const lastLocations = fetchedLocations.map((loc) => loc.lastLocation).filter((loc) => loc !== null)
        //only return the locations which are not null
        return lastLocations
    }
    catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}

//accepted requests so that when a users location is updated, it is only sent to those users who have accepted his request
export async function getAcceptedList(userId) {
    try{
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { sentRequests: true, receivedRequests: true }
        })
        //in case user doesnt exist
        if(!user) { throw new Error("User Not Found")}
        //here we do not need the id of the user himself
        //i.e. if he sends a request to someone, we need only the recipient id and vice versa
        // and if he has accepted a request, we need only the sender id
        const acceptedRequests = [...user.sentRequests.filter((element) => element.status === 'ACCEPTED').map((element) => element.recipientId),
                                  ...user.receivedRequests.filter((element) => element.status === 'ACCEPTED').map((element) => element.senderId),]
        return acceptedRequests
    }
    catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}

export async function getInitialData(userId) {
    try{
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { sentRequests: true, receivedRequests: true }
        })
        const lastLocations = await getUserLocation(userId)
        //reusing code from userServices to get accpted, pending, rejected requests
        const acceptedRequests = [...user.sentRequests.filter((element) => element.status === 'ACCEPTED').map((element) => element.recipientId),
                                  ...user.receivedRequests.filter((element) => element.status === 'ACCEPTED').map((element) => element.senderId),]
        const sentRequests = [...user.sentRequests.filter((element) => element.status === 'PENDING').map((element) => element.recipientId)]
        const receivedRequests = [...user.receivedRequests.filter((element) => element.status === 'PENDING').map((element) => element.senderId)]
        const rejectedRequests = [...user.sentRequests.filter((element) => element.status === 'REJECTED').map((element) => element.recipientId),
                                  ...user.receivedRequests.filter((element) => element.status === 'REJECTED').map((element) => element.senderId),]
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            select: { username: true, email: true, lastLocation: true }
        })
        console.log(userData)
        return { lastLocations, acceptedRequests, sentRequests, receivedRequests, rejectedRequests, userData }
    }
    catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}   

export async function updateUserLocation(userId, lat, log) {
    try{
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { 
                lastLocation: {
                    upsert:{
                    //updates if exists
                    update: {
                        latitude: lat,
                        longitude: log
                    },
                    //creates if doesnt exist
                    create: {
                        latitude: lat,
                        longitude: log
                    }
                    }
                }
             },
            include: { lastLocation: true }
        })
        //emit the new location to
        const io = getIOInstance()
        const accepted = getAcceptedList(userId)
        if(io && updatedUser.lastLocation) {
            io.to(accepted).emit('locationUpdate', { userId: userId, location: updatedUser.lastLocation })
            console.log(`Emitted location update for user ${userId} to accepted friends.`)
        }
        return updatedUser
    }catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}

export async function updateRequestStatus(senderId, recipientId, status) {
    try{
        const request = await prisma.requests.findFirst({
            where: { OR: [
                    { senderId: senderId, recipientId: recipientId },
                    { senderId: recipientId, recipientId: senderId } //check both directions
                ] }
        })
        let updatedRequest
        if(request){
            updatedRequest = await prisma.requests.update({
                where: { id: request.id },
                data: { status: status }
            })
        }
        else{
            updateRequest = await prisma.requests.create({
                data: { senderId: senderId, recipientId: recipientId, status: status }
            })
        }
        if(!updateRequest) { throw new Error("Failed to update request")}
        const io = getIOInstance()
        if(!io) { throw new Error("Socket IO instance not found")}
        io.to([senderId, recipientId]).emit('requestStatusUpdate', { senderId, recipientId, status })
        console.log(`Request status updated to ${status}`)
        return updateRequest
    }
    catch(err){
        console.log(err)
        throw new Error(err.message || "Internal Server Error")
    }
}