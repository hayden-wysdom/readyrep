import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery] = useState(false);

  useEffect(() => {
    // Request user data from parent window
    window.parent.postMessage({ type: 'WYSDOM_REQUEST_USER_DATA' }, '*');

    // Listen for user data from parent window
    const handleMessage = (event) => {
      if (event.data?.type === 'WYSDOM_USER_DATA') {
        const payload = event.data.payload;

        // Split full_name into first_name and last_name
        const [firstName, ...lastNameParts] = (payload.full_name || '').split(' ');
        const lastName = lastNameParts.join(' ');

        // Create mock user object matching Supabase user format
        const mockUser = {
          id: payload.id,
          email: payload.email,
          user_metadata: {
            first_name: firstName || '',
            last_name: lastName || '',
            specialty: payload.specialty || '',
            npi: '', // Not provided by parent, leave empty
            practice_city: payload.institution || '', // Map institution to practice_city
            practice_state: '', // Not provided by parent, leave empty
          }
        };

        setUser(mockUser);
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // No-op stub functions
  const signUp = async () => {
    return { data: null, error: null };
  };

  const signIn = async () => {
    return { data: null, error: null };
  };

  const signOut = async () => {
    return { error: null };
  };

  const resetPassword = async () => {
    return { data: null, error: null };
  };

  const updatePassword = async () => {
    return { data: null, error: null };
  };

  const verifyNotOldPassword = async () => {
    return { isSame: false };
  };

  return (
    <AuthContext.Provider value={{
      user, loading, isRecovery, setIsRecovery: () => {},
      signUp, signIn, signOut, resetPassword, updatePassword, verifyNotOldPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}
