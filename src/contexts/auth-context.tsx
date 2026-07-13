import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { Role, UserProfile } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  updateUserRole: (role: Role) => void; // Used for mocking role since no DB is set up yet
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      setFirebaseUser(currentFirebaseUser);

      if (currentFirebaseUser) {
        // In a real app, you would fetch the user profile (and role) from Firestore here
        // For Phase 3, we'll default to 'FAN' and allow modifying it for testing

        // Let's check local storage to persist mock roles during development
        const storedRole = localStorage.getItem(`role_${currentFirebaseUser.uid}`) as Role;
        const assignedRole: Role = storedRole || 'FAN';

        setUser({
          uid: currentFirebaseUser.uid,
          email: currentFirebaseUser.email || '',
          displayName: currentFirebaseUser.displayName,
          role: assignedRole,
          createdAt: currentFirebaseUser.metadata.creationTime || new Date().toISOString(),
        });
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateUserRole = (role: Role) => {
    if (user && firebaseUser) {
      localStorage.setItem(`role_${firebaseUser.uid}`, role);
      setUser({ ...user, role });
    }
  };

  const value = {
    user,
    firebaseUser,
    isLoading,
    signOut,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
