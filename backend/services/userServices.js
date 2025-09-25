import { PrismaClient } from "../generated/prisma/index.js"

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