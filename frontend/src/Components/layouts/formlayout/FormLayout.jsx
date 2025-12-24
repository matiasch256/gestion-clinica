import React from "react";
import { Box } from "@mui/material";
import { Form } from "../../Components/form/Form";

export const FormLayout = ({ formToggle, formTitle, submitButtonText }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "400px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Form
          formToggle={formToggle}
          formTitle={formTitle}
          submitButtonText={submitButtonText}
        />

        <Box
          sx={{
            mt: 3,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        ></Box>
      </Box>
    </Box>
  );
};
