import { raw } from "@prisma/client/runtime/library"
import { getInitialData, updateRequestStatus, updateUserLocation } from "../services/dbServices.js"

export async function formattedInitialData(req, res) {
    try{
        const userid = req.query.userid
        if(!userid){
            console.log(userid)
            return res.status(400).json({ error: "User ID is required"})
        }
        const initialData = await getInitialData(userid)
        return res.status(200).json({ data: initialData })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: err.message || "Internal Server Error"})
    }
}

export async function locController(req, res) {
    try{
        const userid = req.userId
        const lat = req.body.latitude
        const log = req.body.longitude
        console.log(userid, lat, log)
        if(!userid || !lat || !log){
            return res.status(400).json({ error: "User ID and location are required"})
        }
        const updatedUser = await updateUserLocation(userid, lat, log)
        return res.status(200).json({ message: "Location updated successfully", location: updatedUser.lastLocation })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: err.message || "Internal Server Error"})
    }
}

export async function requestController(req, res) {
    try{
        const { senderId, recipientId, status } = req.body
        if(!senderId || !recipientId || !status){
            return res.status(400).json({ error: "Sender ID, Recipient ID and status are required"})
        }
        const updatedRequest = await updateRequestStatus(senderId, recipientId, status)
        return res.status(200).json({ message: "Request status updated successfully", request: updatedRequest })
    }
    catch(err){     
        console.log(err)
        return res.status(500).json({ error: err.message || "Internal Server Error"})
    }
}

