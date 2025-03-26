export const KEY_TOKEN="accessToken";
export const KEY_USER_ID="userId";
export const KEY_USER_DATA="user";

//TOKEN
export const setToken=(token)=>{
    localStorage.setItem(KEY_TOKEN,token);
};

export const getToken=()=>{
    return localStorage.getItem(KEY_TOKEN);
};

export const removeToken=()=>{
    return localStorage.removeItem(KEY_TOKEN);
}

//USER ID
export const setUserId=(userId)=>{
    localStorage.setItem(KEY_USER_ID,userId);
}

export const getUserId=()=>{
    return localStorage.getItem(KEY_USER_ID);
}

export const removeUserId=()=>{
    return localStorage.removeItem(KEY_USER_ID);
}

//USER ID
export const setUser=(user)=>{
    localStorage.setItem(KEY_USER_DATA,user);
}

export const getUser=()=>{
    return localStorage.getItem(KEY_USER_DATA);
}

export const removeUser=()=>{
    return localStorage.removeItem(KEY_USER_DATA);
}

