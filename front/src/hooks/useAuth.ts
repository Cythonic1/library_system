import apiClient from '@/lib/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  create_at: string;
  email: string;
  update_at: string;
  user_id: string;
  username: string;
  role: 'user' | 'admin' | 'librarian';
}

interface AuthState {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  error: Error | null;
  data: User | null;
  checkAuth: () => Promise<void>
}
// this is auth function to check if the user 
// is authenticated or not
function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  return new Error(String(error));
}

export const useAuth = (): AuthState => {
  const navigate = useNavigate();

  const [state, setState] = useState<Omit<AuthState, 'checkAuth'>>({
    isAuthenticated: null,
    isLoading: true,
    data: null,
    error: null,
  });

  const checkAuth = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await apiClient.get('/api/session');

      setState({
        isAuthenticated: response.status === 200,
        isLoading: false,
        data: response.data[0] as User,
        error: null,
      });
    } catch (error) {
      console.error(error);

      setState({
        isAuthenticated: false,
        isLoading: false,
        data: null,
        error: normalizeError(error),
      });

      navigate('/sign-in', { replace: true });
    }
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  return { ...state, checkAuth };
};
