import React from "react";
import { Box, Typography, Button } from "@mui/material";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            Algo salió mal.
          </Typography>
          <Button
            variant="contained"
            onClick={() => this.setState({ hasError: false })}
            sx={{ mt: 2 }}
          >
            Intentar de nuevo
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
