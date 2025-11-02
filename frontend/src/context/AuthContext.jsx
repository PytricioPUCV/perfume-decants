import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Función de registro
  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      
      if (data.success) {
        const { token, ...user } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función de login
  const login = async (credentials) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      
      if (data.success) {
        const { token, ...user } = data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Actualizar perfil
  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/perfil', profileData);
      
      if (data.success) {
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Verificar si es admin
  const isAdmin = () => {
    return user?.rol === 'admin';
  };

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isAdmin,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
