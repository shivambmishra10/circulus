// contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // const DEFAULT_USER = {
  //   id: 1,
  //   email: 'test@example.com',
  //   name: 'Test User',
  // };

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     try {
  //       const token = localStorage.getItem('token');

  //       // Development-only: Auto-login with default user if no token exists
  //       if (process.env.NODE_ENV === 'development' && !token) {
  //         localStorage.setItem('token', 'mock-token-for-development');
  //         api.defaults.headers.common['Authorization'] = 'Token mock-token-for-development';
  //         setUser(DEFAULT_USER);
  //         setLoading(false);
  //         return;
  //       }

  //       if (token) {
  //         api.defaults.headers.common['Authorization'] = `Token ${token}`;
  //         const response = await api.get('/api/auth/user/');
  //         setUser(response.data);
  //       }
  //     } catch (error) {
  //       console.error('Auth check failed:', error);
  //       localStorage.removeItem('token');
  //       delete api.defaults.headers.common['Authorization'];
  //     }
  //     setLoading(false);
  //   };

  //   checkAuthStatus();
  // }, []);

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          api.defaults.headers.common['Authorization'] = `Token ${token}`;
          const response = await api.get('/api/auth/user/');
          setUser(response.data);
          console.log("success user:",response.data)
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login/', {username: email, password });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    
    setUser(user);
    return user;
  };

  const register = async (email, password1, password2) => {
    const response = await api.post('/api/auth/register/', {
      email,
      username:email,
      password1,
      password2
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const googleLogin = async (accessToken) => {
    const response = await api.post('/api/auth/google/', { access_token: accessToken });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
    
    setUser(user);
    return user;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        login,
        register,
        logout,
        googleLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated: !!user,
//         user,
//         loading,
//         login,
//         register,
//         logout,
//         googleLogin
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);