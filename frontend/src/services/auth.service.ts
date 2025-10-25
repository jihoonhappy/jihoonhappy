import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.config';
import { User } from '../types';
import { INITIAL_POINTS } from '../config/constants';

export const authService = {
  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        points: INITIAL_POINTS,
        stats: {
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
        },
        createdAt: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: new Date().toISOString(),
      });

      return userData;
    } catch (error: any) {
      throw new Error(error.message || '회원가입에 실패했습니다.');
    }
  },

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (!userDoc.exists()) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: userData.displayName,
        points: userData.points,
        stats: userData.stats,
        createdAt: new Date(userData.createdAt),
      };
    } catch (error: any) {
      throw new Error(error.message || '로그인에 실패했습니다.');
    }
  },

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(error.message || '로그아웃에 실패했습니다.');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: userData.displayName,
      points: userData.points,
      stats: userData.stats,
      createdAt: new Date(userData.createdAt),
    };
  },

  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
