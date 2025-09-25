import rateLimit from 'express-rate-limit'

export const login_limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5, //5 req per 10 minutes
  message: 'You have reached the request limits. Please try again later',
  standardHeaders: true,//new format apparently
  legacyHeaders: false,//older one 
})
//registr
export const reg_limiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 10, //10 req per hour
  message: 'You have reached the request limits. Please try again later',
  standardHeaders: true,//new format apparently
  legacyHeaders: false,//older one 
})
//logout
export const logout_limiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100, //5 req per 10 minutes
  message: 'You have reached the request limits. Please try again later',
  standardHeaders: true,//new format apparently
  legacyHeaders: false,//older one 
})