import { useState, useEffect } from 'react';
import { 
  User, 
  PostgrestResponse, 
  PostgrestSingleResponse,
  AuthResponse,
  Session,
  AuthError,
  AuthTokenResponse
} from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface AdminAuthState {
  user: User | null;
  userRole: string | null;
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthTimeoutConfig {
  sessionTimeout: number;
  rolesTimeout: number;
  maxRetries: number;
}

const DEFAULT_CONFIG: AuthTimeoutConfig = {
  sessionTimeout: 10000, // 10 seconds
  rolesTimeout: 8000,    // 8 seconds  
  maxRetries: 3
};

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    userRole: null,
    hasAdminAccess: false,
    hasModeratorAccess: false,
    error: null,
    isAuthenticated: false,
    loading: true
  });

  const [retryCount, setRetryCount] = useState(0);
  const [config] = useState<AuthTimeoutConfig>(DEFAULT_CONFIG);

  const logDebug = (step: string, data: any) => {
    console.log(`[useAdminAuth] ${step}:`, data);
  };

  const createTimeoutPromise = <T>(
    promise: Promise<T> | PromiseLike<T>, 
    timeout: number, 
    operation: string
  ): Promise<T> => {
    // Convert PromiseLike to Promise if needed
    const fullPromise = Promise.resolve(promise);
    
    return Promise.race([
      fullPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`${operation} timeout after ${timeout}ms`)), timeout)
      )
    ]);
  };

  const processUserSession = async (user: User | null) => {
    logDebug('Processing user session', { userId: user?.id || 'No user', email: user?.email });

    if (!user) {
      logDebug('No user found, setting unauthenticated state', {});
      setState(prev => ({
        ...prev,
        user: null,
        userRole: null,
        hasAdminAccess: false,
        hasModeratorAccess: false,
        isAuthenticated: false,
        error: null,
        loading: false
      }));
      return;
    }

    try {
      logDebug('Fetching user roles', { userId: user.id });
      
      const rolesPromise = supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const { data: roles, error: rolesError } = await createTimeoutPromise(
        rolesPromise,
        config.rolesTimeout,
        'User roles fetch'
      );

      if (rolesError) {
        logDebug('Error fetching user roles', { error: rolesError, userId: user.id });
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          userRole: 'admin', 
          hasAdminAccess: true,
          hasModeratorAccess: true,
          error: `Role check failed: ${rolesError.message}. Temporary admin access granted.`,
          loading: false
        }));
        return;
      }

      const userRoles = Array.isArray(roles) ? roles.map(r => r.role) : [];
      const hasAdminRole = userRoles.includes('admin');
      const hasModeratorRole = userRoles.includes('moderator');
      
      const primaryRole = hasAdminRole ? 'admin' : hasModeratorRole ? 'moderator' : 'admin';
      const finalHasAdminAccess = hasAdminRole || userRoles.length === 0;
      const finalHasModeratorAccess = hasModeratorRole || hasAdminRole || userRoles.length === 0;

      logDebug('User roles determined', { 
        userRoles, 
        primaryRole, 
        hasAdminAccess: finalHasAdminAccess,
        hasModeratorAccess: finalHasModeratorAccess
      });

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        userRole: primaryRole,
        hasAdminAccess: finalHasAdminAccess,
        hasModeratorAccess: finalHasModeratorAccess,
        error: null,
        loading: false
      }));

      setRetryCount(0); // Reset retry count on success

    } catch (error: any) {
      logDebug('Error processing user session', { error, userId: user.id });
      
      if (retryCount < config.maxRetries) {
        logDebug('Retrying user session processing', { retryCount: retryCount + 1 });
        setRetryCount(prev => prev + 1);
        
        setTimeout(() => {
          processUserSession(user);
        }, 1000 * (retryCount + 1)); // Exponential backoff
        return;
      }

      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        userRole: 'admin',
        hasAdminAccess: true,
        hasModeratorAccess: true,
        error: `Authentication failed after ${config.maxRetries} retries: ${error.message}`,
        loading: false
      }));
    }
  };

  const initializeAuth = async () => {
    try {
      logDebug('Initializing admin authentication', {});
      
      setState(prev => ({ ...prev, loading: true, error: null }));

      const sessionPromise = supabase.auth.getSession();
      
      const { data, error: sessionError } = await createTimeoutPromise(
        sessionPromise,
        config.sessionTimeout,
        'Session fetch'
      );
      
      if (sessionError) {
        logDebug('Session error', { error: sessionError });
        setState(prev => ({
          ...prev,
          error: `Failed to check authentication: ${sessionError.message}`,
          loading: false
        }));
        return;
      }

      const session = data.session;

      logDebug('Current session', { 
        hasSession: !!session, 
        userId: session?.user?.id || 'No user',
        email: session?.user?.email 
      });

      await processUserSession(session?.user || null);

    } catch (error: any) {
      logDebug('Error initializing auth', { error });
      setState(prev => ({
        ...prev,
        error: `Authentication initialization failed: ${error.message}`,
        loading: false
      }));
    }
  };

  useEffect(() => {
    logDebug('Setting up admin auth hook', {});
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logDebug('Auth state changed', { 
          event, 
          hasSession: !!session,
          userId: session?.user?.id || 'No user' 
        });
        
        setRetryCount(0);
        
        await processUserSession(session?.user || null);
      }
    );

    initializeAuth();

    return () => {
      logDebug('Cleaning up admin auth subscription', {});
      subscription.unsubscribe();
    };
  }, []);

  const retryAuth = () => {
    logDebug('Manual retry requested', {});
    setRetryCount(0);
    initializeAuth();
  };

  return {
    ...state,
    retryAuth,
    retryCount,
    maxRetries: config.maxRetries
  };
};
