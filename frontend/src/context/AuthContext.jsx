import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // store logged in user object
  const [token, setToken] = useState(null); // store JWT token
  const [loading, setLoading] = useState(true); // for initial load

  useEffect(() => {
    // Load from localStorage on first render
    const savedUser = localStorage.getItem('jobtrackr_user');
    const savedToken = localStorage.getItem('jobtrackr_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('jobtrackr_user', JSON.stringify(userData));
    localStorage.setItem('jobtrackr_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jobtrackr_user');
    localStorage.removeItem('jobtrackr_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
