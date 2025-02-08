import getMultipleData from 'commons/utils/getMultipleData'
import { db } from '../config/firebaseConfig'
import { User } from '../entities/user'

const usersCollection = db.collection('USERS')

export const fetchUserData = async (
  startAt: number,
  limit: number
): Promise<{ count: number; data: User[]; totalPage: number }> => {
  const [users, count] = await Promise.all([
    usersCollection
      .orderBy('totalAverageWeightRatings', 'desc')
      .orderBy('numberOfRents', 'desc')
      .orderBy('recentlyActive', 'desc')
      .offset(startAt)
      .limit(limit)
      .get(),
    usersCollection.count().get()
  ])

  return {
    count: count.data().count,
    data: getMultipleData(users.docs),
    totalPage: Math.ceil(count.data().count / limit)
  }
}

export const updateUserData = async (userId: string, userData: Partial<User>): Promise<void> => {
  await usersCollection.doc(userId).update(userData)
}
