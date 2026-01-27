import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ReportProvider } from "./context/ReportContext.jsx";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ReportProvider>
          <AppRoutes />
        </ReportProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
