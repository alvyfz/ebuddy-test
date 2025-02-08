import express from 'express'
import { authMiddleware } from '../middleware'
import { fetchUser, updateUser } from '../controller/userController'

const router = express.Router()

// Endpoint untuk mengambil data user
router.get('/fetch-user-data', authMiddleware, fetchUser)

// Endpoint untuk mengupdate data user
router.put('/update-user-data/:userId', authMiddleware, updateUser)

export default router
