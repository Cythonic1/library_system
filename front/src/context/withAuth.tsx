import axios from 'axios';
import React, { ComponentType, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthWrapperProps {
  // You can add any additional props your wrapped components might need
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>): React.FC<P & AuthWrapperProps> => {
  return function AuthWrapper(props: P & AuthWrapperProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Replace with your actual API base URL
          const response = await axios.get('/check', {
            withCredentials: true // Include this if you're using cookies for auth
          });

          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            navigate('/sign-in');
          }
        } catch (error) {
          setIsAuthenticated(false);
          navigate('/sign-in');
        }
      };

      checkAuth();
    }, [navigate]);

    // Show loading state while checking auth
    if (isAuthenticated === null) {
      return <div>Loading...</div>; // Or your custom loading component
    }

    // Only render the wrapped component if authenticated
    if (isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    // If not authenticated, you'll be redirected to sign-in
    return null;
  };
};

export default withAuth;