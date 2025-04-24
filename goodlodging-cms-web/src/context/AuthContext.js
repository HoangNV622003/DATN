import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../apis/account/UserService";
import { fetchAllAddress } from "../apis/address/AddressService";
import { getToken, getUserId, KEY_TOKEN, KEY_USER_ID, removeToken, removeUser, removeUserId, setUserId } from "../utils/service/localStorageService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getToken() || null);
    const [loading, setLoading] = useState(true);
    const [isLogin, setIsLogin] = useState(false);
    const [addressData, setAddressData] = useState([]);
    const storedUserId = getUserId();

    const login = (newToken) => {
        localStorage.setItem(KEY_TOKEN, newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        const userId = decoded.user_id;
        setUserId(userId)
        fetchUserInfo(userId, newToken);
    };

    const logout = () => {
        removeToken();
        removeUser();
        removeUserId();
        setToken(null);
        setUser(null);
        setIsLogin(false);
        window.location.reload();
    };

    const fetchAddress = async () => {
        try {
            const response = await fetchAllAddress();
            setAddressData(response);
        } catch (error) {
            console.log("Lỗi khi lấy địa chỉ", error);
        }
    };

   
    const fetchUserInfo = async (userId, accessToken) => {
        try {
            const response = await getUser(userId, accessToken);
            setUser(response.data);
            setIsLogin(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = getToken();

            // Load địa chỉ trước
            await fetchAddress();

            if (storedToken) {
                try {
                    const decoded = jwtDecode(storedToken);
                    const userId = decoded.user_id;
                    if (userId) {
                        await fetchUserInfo(userId, storedToken);
                    } else {
                        logout(); // Token không khớp với userId
                    }
                } catch (error) {
                    console.error("Token không hợp lệ:", error);
                    logout();
                }
            } else {
                setLoading(false);
                setIsLogin(false);
            }
        };

        initializeAuth();
    }, [storedUserId]);

    return (
        <AuthContext.Provider
            value={{ user, addressData, token, isLogin, login, logout, loading,setUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};