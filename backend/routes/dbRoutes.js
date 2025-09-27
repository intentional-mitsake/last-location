import { Router } from "express"
import { formattedInitialData, locController, requestController } from "../controllers/dbControllers.js"
import { verifyToken } from "../middleware/tokenVefify.js"

const router = Router()

router.get('/initial', formattedInitialData)

router.put('/location', verifyToken, locController) //location update

router.put('/request', requestController) //request status update

export default router