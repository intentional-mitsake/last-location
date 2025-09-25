import { Router } from "express"
import { fetchLocation } from "../controllers/userControllers.js"

const router = Router()

router.get('/location', fetchLocation)

export default router