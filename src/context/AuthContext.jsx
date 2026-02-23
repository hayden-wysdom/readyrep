import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        // Detect when user arrives via password reset link
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecovery(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`
    });
    return { data, error };
  };

  const updatePassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (!error) {
      setIsRecovery(false);
    }
    return { data, error };
  };

  // Check if the new password is the same as the old one by trying to sign in
  const verifyNotOldPassword = async (newPassword) => {
    const email = user?.email;
    if (!email) return { isSame: false };
    const { error } = await supabase.auth.signInWithPassword({ email, password: newPassword });
    // If sign-in succeeds, it means the new password is the same as the old one
    return { isSame: !error };
  };

  return (
    <AuthContext.Provider value={{
      user, loading, isRecovery, setIsRecovery,
      signUp, signIn, signOut, resetPassword, updatePassword, verifyNotOldPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}
