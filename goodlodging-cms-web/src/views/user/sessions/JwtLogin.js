import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const JwtLogin = () => {
    const navigate=useNavigate();
    const handleNavigateToRegister = ()=>{
        navigate('/register')
    }
    const handleNavigateToHomePage = ()=>{
        navigate('/')
    }
    return (
        <form>
            <h1>login</h1>
            <button onClick={handleNavigateToHomePage}>Login</button>
            <button onClick={handleNavigateToRegister}>register</button>
        </form>
    );
};

export default JwtLogin;