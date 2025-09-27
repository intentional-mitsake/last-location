import { Router } from "express"
import { formattedInitialData, locController } from "../controllers/dbControllers.js"

const router = Router()

router.get('/initial', formattedInitialData)

router.put('/location', locController) //location update

router.put('/request', locController) //request status update

export default router