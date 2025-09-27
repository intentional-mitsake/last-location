import { getInitialData } from "../services/dbServices.js"

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