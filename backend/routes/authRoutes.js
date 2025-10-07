import express from 'express'
import { regCredVerification, logCredVerification } from '../controllers/authControllers.js'
import { login_limiter, reg_limiter, logout_limiter } from '../middleware/rate_limiter.js'
import { reqValidator, tokenVerification } from '../middleware/authMiddleware.js'
import { logout } from '../services/authServices.js'
import { verifyToken } from '../middleware/tokenVefify.js'
const router = express.Router()

//registration
router.post('/register', reqValidator, reg_limiter, regCredVerification)

//login
router.post('/login', reqValidator, login_limiter,  logCredVerification)

//logout
router.post('/logout', logout_limiter, verifyToken,  logout)

export default router