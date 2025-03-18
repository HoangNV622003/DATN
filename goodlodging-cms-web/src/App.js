import { BrowserRouter } from "react-router-dom";
import RouterCustom from "./Router";
import { AuthProvider } from "./context/AuthContext";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouterCustom />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
