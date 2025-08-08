import React from "react";
import { Button } from "@mui/material";
import { outlinedPrimaryButton } from "../../styles/buttonStyles";

const QuickActionButton = ({ icon, label, onClick }) => {
  return (
    <Button
      variant="outlined"
      startIcon={icon}
      onClick={onClick}
      sx={outlinedPrimaryButton}
    >
      {label}
    </Button>
  );
};

export default QuickActionButton;
