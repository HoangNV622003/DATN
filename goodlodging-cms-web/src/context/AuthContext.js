// import React, { createContext, useState, useEffect, useContext } from "react";
// import { jwtDecode } from "jwt-decode";
// import { getUser } from "../apis/account/UserService";
// import { fetchAllAddress } from "../apis/address/AddressService";
// import { getToken, getUserId, KEY_TOKEN, KEY_USER_ID, removeToken, removeUser, removeUserId } from "../utils/service/localStorageService";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(getToken() || null);
//     const [loading, setLoading] = useState(true);
//     const [isLogin, setIsLogin] = useState(false);
//     const [addressData, setAddressData] = useState([]);
//     const storedUserId = getUserId();
//     const login = (newToken) => {
//         localStorage.setItem(KEY_TOKEN, newToken);
//         setToken(newToken);
//         const decoded = jwtDecode(newToken);
//         const userId = decoded.user_id;
//         localStorage.setItem(KEY_USER_ID, userId);
//         console.log("userID:", userId);
//         fetchUserInfo(userId, newToken);
//     };

//     const logout = () => {
//         removeToken()
//         removeUser()
//         removeUserId();
//         setToken(null);
//         setUser(null);
//         setIsLogin(false);
//         console.log("Đã đăng xuất", { token, user, isLogin });
//         window.location.reload();
//     };

//     const fetchAddress = async () => {
//         try {
//             const response = await fetchAllAddress();
//             setAddressData(response);
//             console.log("address loaded:", response);
//         } catch (error) {
//             console.log("Lỗi khi lấy địa chỉ", error);
//         }
//     };

//     const fetchUserInfo = async (userId, accessToken) => {
//         try {
//             const response = await getUser(userId, accessToken);
//             setUser(response);
//             setIsLogin(true);
//             console.log("isLogin:", true);
//             console.log("user:", response);
//             console.log("token:",token);
//         } catch (error) {
//             console.error("Lỗi khi lấy thông tin người dùng:", error);
//             logout();
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         const initializeAuth = async () => {
//             const storedToken = getToken();
//             await fetchAddress(); // Chờ load địa chỉ trước

//             if (storedToken && storedUserId) {
//                 try {
//                     const decoded = jwtDecode(storedToken);
//                     const userId = decoded.user_id;
//                     await fetchUserInfo(userId, storedToken); // Chờ load user info
//                 } catch (error) {
//                     console.error("Token không hợp lệ:", error);
//                     logout();
//                     setLoading(false);
//                 }
//             } else {
//                 setLoading(false);
//                 setIsLogin(false);
//             }
//         };

//         initializeAuth();
//     }, [storedUserId,token]);

//     return (
//         <AuthContext.Provider
//             value={{ user, addressData, token, isLogin, login, logout, loading }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../apis/account/UserService";
import { fetchAllAddress } from "../apis/address/AddressService";
import { getToken, getUserId, KEY_TOKEN, KEY_USER_ID, removeToken, removeUser, removeUserId } from "../utils/service/localStorageService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(getToken() || null);
    const [loading, setLoading] = useState(true); // Bắt đầu với true để hiển thị loading
    const [isLogin, setIsLogin] = useState(false);
    const [addressData, setAddressData] = useState([]);
    const storedUserId = getUserId();

    const login = (newToken) => {
        localStorage.setItem(KEY_TOKEN, newToken);
        setToken(newToken);
        const decoded = jwtDecode(newToken);
        const userId = decoded.user_id;
        localStorage.setItem(KEY_USER_ID, userId);
        console.log("userID:", userId);
        fetchUserInfo(userId, newToken);
    };

    const logout = () => {
        removeToken();
        removeUser();
        removeUserId();
        setToken(null);
        setUser(null);
        setIsLogin(false);
        console.log("Đã đăng xuất", { token, user, isLogin });
        window.location.reload();
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
            console.log("token:", token);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            logout();
        } finally {
            setLoading(false); // Kết thúc loading dù thành công hay thất bại
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const storedToken = getToken();
            await fetchAddress(); // Load địa chỉ trước

            if (storedToken && storedUserId) {
                try {
                    const decoded = jwtDecode(storedToken);
                    const userId = decoded.user_id;
                    await fetchUserInfo(userId, storedToken); // Load thông tin user
                } catch (error) {
                    console.error("Token không hợp lệ:", error);
                    logout();
                }
            } else {
                setLoading(false); // Không có token, kết thúc loading
                setIsLogin(false);
            }
        };

        initializeAuth();
    }, [storedUserId]);

    return (
        <AuthContext.Provider
            value={{ user, addressData, token, isLogin, login, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};