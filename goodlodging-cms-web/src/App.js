import { BrowserRouter } from "react-router-dom";
import RouterCustom from "./Router";
import { AuthProvider,useAuth } from "./context/AuthContext";
import Loading from "./components/loading/Loading";
function AppContent() {
  const { loading } = useAuth(); // Lấy trạng thái loading từ AuthContext

    return (
        <>
            {loading && <Loading />} {/* Hiển thị overlay khi loading */}
            <BrowserRouter>
                <RouterCustom />
            </BrowserRouter>
        </>
    );
}
function App() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}

export default App;
