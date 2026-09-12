import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('fsc_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('fsc_token', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username });
      } catch (e) {
        setToken(null);
        setUser(null);
        localStorage.removeItem('fsc_token');
      }
    } else {
      localStorage.removeItem('fsc_token');
      setUser(null);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      setToken(data.token);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
