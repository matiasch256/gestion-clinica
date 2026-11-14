import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme/theme";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { FeedbackProvider } from "./context/FeedbackProvider";

function Main() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={getTheme()}>
        <AuthProvider>
          <CssBaseline />
          <FeedbackProvider>
            <App />
          </FeedbackProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
