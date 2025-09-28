import { db } from './firebase';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

// Save user to Firestore users collection
export const saveUserToFirestore = async (userData) => {
  try {
    const usersRef = collection(db, 'users');
    const docRef = await addDoc(usersRef, {
      ...userData,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, userId: docRef.id };
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Get user from Firestore by email
export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return { 
        success: true, 
        user: { 
          id: userDoc.id, 
          ...userDoc.data() 
        } 
      };
    } else {
      return { success: false, user: null };
    }
  } catch (error) {
    console.error('Error getting user from Firestore:', error);
    return { success: false, error: error.message };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { 
        success: true, 
        user: { 
          id: userSnap.id, 
          ...userSnap.data() 
        } 
      };
    } else {
      return { success: false, user: null };
    }
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return { success: false, error: error.message };
  }
};

// Signup with Firestore integration
export const signupWithFirestore = async (email, password, userData) => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Save user data to Firestore
    const userDataToSave = {
      email: email,
      uid: firebaseUser.uid,
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      ...userData
    };
    
    const result = await saveUserToFirestore(userDataToSave);
    
    if (result.success) {
      return { 
        success: true, 
        user: firebaseUser,
        firestoreUserId: result.userId 
      };
    } else {
      // If Firestore save fails, we should handle this appropriately
      console.error('Failed to save user to Firestore:', result.error);
      return { 
        success: false, 
        error: 'Failed to save user data' 
      };
    }
  } catch (error) {
    console.error('Error in signup:', error);
    return { success: false, error: error.message };
  }
};

// Login with Firestore verification
export const loginWithFirestore = async (email, password) => {
  try {
    // First check if user exists in Firestore
    const userResult = await getUserByEmail(email);
    
    if (!userResult.success || !userResult.user) {
      return { 
        success: false, 
        error: 'User not found in database' 
      };
    }
    
    // Authenticate with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    return { 
      success: true, 
      user: firebaseUser,
      userData: userResult.user 
    };
  } catch (error) {
    console.error('Error in login:', error);
    return { success: false, error: error.message };
  }
};

// Get all users (for admin dashboard)
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching all users:', error);
    return { success: false, error: error.message, users: [] };
  }
};

// Update user role
export const updateUserRole = async (userId, role) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: error.message };
  }
};
