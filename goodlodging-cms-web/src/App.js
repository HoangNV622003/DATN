import { BrowserRouter } from "react-router-dom";
import RouterCustom from "./Router";
import { AuthProvider,useAuth } from "./context/AuthContext";
import Loading from "./components/loading/Loading";
import { ToastContainer } from "react-toastify";
import { ChatProvider } from "./context/ChatContext";
import ChatIcon from "./components/chatBot/ChatIcon";
import Chatbot from "./components/chatBot/ChatBot";
function AppContent() {
  const { loading } = useAuth(); // Lấy trạng thái loading từ AuthContext

  return (
      <>
          {loading && <Loading />} {/* Hiển thị overlay khi loading */}
          <BrowserRouter>
              <RouterCustom />
          </BrowserRouter>
          <ChatIcon />
          <Chatbot />
          <ToastContainer />
      </>
  );
}

function App() {
  return (
      <AuthProvider>
          <ChatProvider>
              <AppContent />
          </ChatProvider>
      </AuthProvider>
  );
}

export default App;
