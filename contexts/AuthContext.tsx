// app/contexts/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; //
import { Session, User } from '@supabase/supabase-js';

// ... (Keep existing types and context definition)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for real session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        setLoading(false);
      } else {
        // --- GUEST LOGIN FOR TESTING ---
        // If no session exists, we inject a "Mock User"
        const guestUser = {
          id: '00000000-0000-0000-0000-000000000000', // Valid UUID format
          email: 'guest@test.com',
          user_metadata: { full_name: 'Guest Tester' },
        } as User;

        setUser(guestUser);
        setLoading(false);
        // -------------------------------
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        setUser(session.user);
      } else {
        // Fallback to guest if user signs out during testing
        setUser({ id: 'guest-id', email: 'guest@test.com' } as User);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ... (Keep existing signOut and return values)
};