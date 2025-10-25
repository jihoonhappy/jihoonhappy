import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { User, UserStats } from '../types';

export const userService = {
  async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));

      if (!userDoc.exists()) {
        return null;
      }

      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email,
        displayName: data.displayName,
        points: data.points,
        stats: data.stats,
        createdAt: new Date(data.createdAt),
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  async updateDisplayName(userId: string, displayName: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        displayName,
      });
    } catch (error) {
      throw new Error('닉네임 변경에 실패했습니다.');
    }
  },

  async updateUserPoints(userId: string, points: number): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        points,
      });
    } catch (error) {
      throw new Error('포인트 업데이트에 실패했습니다.');
    }
  },

  async updateUserStats(userId: string, stats: UserStats): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        stats,
      });
    } catch (error) {
      throw new Error('전적 업데이트에 실패했습니다.');
    }
  },
};
