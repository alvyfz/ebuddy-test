import { NextFunction, Request, Response } from 'express'
import { fetchUserData, updateUserData } from '../repository/userCollection'
import { User } from '../entities/user'
import NotFoundError from 'commons/exceptions/NotFoundError'
import { resSuccessHandler } from 'commons/exceptions/resHandler'
import app from 'firebase-admin'

// Endpoint untuk mengambil data user
export const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
  const { page, size } = req.query
  try {
    const startAt = Number(size) * (Number(page) - 1)
    const userData = await fetchUserData(startAt, Number(size))
    if (!userData) {
      throw new NotFoundError('User not found')
    }
    resSuccessHandler(res, 'Success', userData)
  } catch (error) {
    next(error)
  }
}

// Endpoint untuk mengupdate data user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId
  const userData: Partial<User> = req.body

  try {
    await updateUserData(userId, {
      ...userData,
      recentlyActive: app.firestore.Timestamp.fromDate(new Date(userData.recentlyActive))
    })
    resSuccessHandler(res, 'User data updated successfully')
  } catch (error) {
    next(error)
  }
}
