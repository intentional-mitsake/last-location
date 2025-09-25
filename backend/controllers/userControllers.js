import { getUserLocation } from "../services/userServices.js"

export async function fetchLocation(req, res) {
    try{
        const userid = req.query.userid
        if(!userid){
            console.log(userid)
            return res.status(400).json({ error: "User ID is required"})
        }
        const fetchedLocations = await getUserLocation(userid)
        return res.status(200).json({ locations: fetchedLocations })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ error: err.message || "Internal Server Error"})
    }
}