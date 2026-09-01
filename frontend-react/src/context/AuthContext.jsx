import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('threatpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const loginWithGoogle = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        role: 'SOC Analyst',
        tier: 'Level 2 Analyst',
      };
      setUser(userData);
      localStorage.setItem('threatpulse_user', JSON.stringify(userData));
    } catch (err) {
      console.error('Error decoding Google token:', err);
    }
  };

  const loginAsDemo = () => {
    const demoUser = {
      name: 'H. Shanmugavel',
      email: 'analyst@threatpulse.sec',
      picture: null,
      role: 'Security Analyst',
      tier: 'Level 2 Analyst',
    };
    setUser(demoUser);
    localStorage.setItem('threatpulse_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('threatpulse_user');
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, loginAsDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
