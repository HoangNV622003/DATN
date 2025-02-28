import './App.css';
import JwtLogin from './views/sessions/JwtLogin';
import { Route, Routes,Navigate, Router } from 'react-router-dom';
import Register from './views/sessions/Register';
import ForgotPassword from './views/sessions/ForgotPassword';
import HomePage from './views/homepage/HomePage';
import { useState } from 'react';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (

      <Routes>
        <Route 
          path="/login" 
          element={<JwtLogin setIsAuthenticated={setIsAuthenticated}/>} 
        />
        <Route path="/register" element={<Register/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route 
          path="/home" 
          element={<HomePage /> } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/login" />} 
        />
      </Routes>
  );
}

export default App;
