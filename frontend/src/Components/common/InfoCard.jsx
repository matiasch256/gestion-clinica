import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const InfoCard = ({ title, content }) => {
  return (
    <>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5">{content}</Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default InfoCard;
