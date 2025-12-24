import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container>
           
      <Box
        sx={{
          p: 4,
          mt: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          textAlign: "center",
        }}
      >
                <LockIcon color="error" sx={{ fontSize: 80 }} />       
        <Typography variant="h4" component="h1" fontWeight="bold">
                    Acceso Denegado (403)        
        </Typography>
               
        <Typography variant="body1">
                    No tienes los permisos necesarios para acceder a esta
          página.        
        </Typography>
               
        <Button variant="contained" onClick={() => navigate(-1)}>
                    Volver a la página anterior      
        </Button>
             
      </Box>
         
    </Container>
  );
};
