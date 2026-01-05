import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check session on load
        const checkAuth = async () => {
            try {
                // We'll need a session check endpoint in PHP later
                const response = await api.get('/check_auth.php');
                if (response.data.isLoggedIn) {
                    setUser(response.data.user);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        const response = await api.post('/login.php', { username, password });
        if (response.data.success) {
            setUser(response.data.user);
            return response.data;
        }
        throw new Error(response.data.error || 'Login failed');
    };

    const logout = async () => {
        try {
            await api.post('/logout.php');
        } catch (e) {
            console.error("Logout API error", e);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
