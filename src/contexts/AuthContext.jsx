import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

let logoutFn = () => {}; // 🔥 Add this at top

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('Stored User:', localStorage.getItem('user'));
  console.log('Stored Token:', localStorage.getItem('token'));


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    console.log('📦 Stored User:', storedUser);
    console.log('🔑 Stored Token:', storedToken);

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);


  
  
  

  const login = (userData) => {
    setUser(userData.user); // ✅ correct
    setToken(userData.token);        // ✅ correct
    localStorage.setItem('user', JSON.stringify(userData.user)); // ✅ store only user
    localStorage.setItem('token', userData.token); // ✅ store token separately
  };
  
  

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  logoutFn = logout; // 🔥 Add this line

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Export logout function for global usage
export const logout = () => logoutFn();
