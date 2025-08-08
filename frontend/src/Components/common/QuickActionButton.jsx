import React from "react";
import { Button } from "@mui/material";

const QuickActionButton = ({ icon, label, onClick }) => {
  return (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={onClick}
      sx={{
        height: 50,
        borderColor: "#1976d2 !important",
        color: "#1976d2 !important",
        backgroundColor: "transparent !important",
        "&:hover": {
          borderColor: "#115293 !important",
          backgroundColor: "rgba(25, 118, 210, 0.04) !important",
        },
      }}
    >
      {label}
    </Button>
  );
};

export default QuickActionButton;
