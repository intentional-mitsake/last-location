import { Router } from "express"
import { formattedInitialData } from "../controllers/dbControllers.js"

const router = Router()

router.get('/initial', formattedInitialData)

export default router