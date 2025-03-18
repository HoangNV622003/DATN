import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUser } from '../apis/account/UserService';
import { fetchAllAddress } from '../apis/address/AddressService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [addressData, setAddressData] = useState([]);

    const login = (newToken) => {
        localStorage.setItem('accessToken', newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        const userId = decoded.user_id;
        localStorage.setItem('userId', userId);
        console.log("userID:", userId);
        fetchUserInfo(userId, newToken);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userId');
        setToken(null);
        setUser(null);
        setIsLogin(false);
        console.log("Đã đăng xuất", { token: null, user: null, isLogin: false });
    };

    const fetchAddress = async () => {
        try {
            const response = await fetchAllAddress();
            setAddressData(response);
            console.log("address loaded:", response);
        } catch (error) {
            console.log("Lỗi khi lấy địa chỉ", error);
        }
    };

    const fetchUserInfo = async (userId, accessToken) => {
        try {
            const response = await getUser(userId, accessToken);
            setUser(response);
            setIsLogin(true);
            console.log("isLogin:", true);
            console.log("user:", response);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = localStorage.getItem('accessToken');
            await fetchAddress(); // Chờ load địa chỉ trước

            if (storedToken) {
                try {
                    const decoded = jwtDecode(storedToken);
                    const userId = decoded.user_id;
                    await fetchUserInfo(userId, storedToken); // Chờ load user info
                } catch (error) {
                    console.error('Token không hợp lệ:', error);
                    logout();
                    setLoading(false);
                }
            } else {
                setLoading(false);
                setIsLogin(false);
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, addressData, token, isLogin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};