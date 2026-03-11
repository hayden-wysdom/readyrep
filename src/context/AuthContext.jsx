import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery] = useState(false);

  useEffect(() => {
    // Request user data from parent window
    window.parent.postMessage({ type: 'WYSDOM_REQUEST_USER_DATA' }, '*');

    // Listen for user data + session token from parent window
    const handleMessage = async (event) => {
      if (event.data?.type === 'WYSDOM_USER_DATA') {
        const payload = event.data.payload;

        // If parent sent a session token, set it in the Supabase client
        // This allows RLS policies (TO authenticated) to work
        if (payload.access_token && payload.refresh_token) {
          try {
            await supabase.auth.setSession({
              access_token: payload.access_token,
              refresh_token: payload.refresh_token,
            });
          } catch (err) {
            console.error('Failed to set Supabase session:', err);
          }
        }

        // Split full_name into first_name and last_name
        const [firstName, ...lastNameParts] = (payload.full_name || '').split(' ');
        const lastName = lastNameParts.join(' ');

        // Create user object matching Supabase user format
        const mockUser = {
          id: payload.id,
          email: payload.email,
          user_metadata: {
            first_name: firstName || '',
            last_name: lastName || '',
            specialty: payload.specialty || '',
            npi: '',
            practice_city: payload.institution || '',
            practice_state: '',
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
