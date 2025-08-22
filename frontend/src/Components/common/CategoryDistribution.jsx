import { Card, CardHeader, CardContent, Typography, Box } from "@mui/material";

const CategoryDistribution = () => {
  const categories = [
    { name: "Papelería", count: 145, color: "#007BFF" },
    { name: "Tecnología", count: 89, color: "#007BFF" },
    { name: "Mobiliario", count: 67, color: "#007BFF" },
    { name: "Limpieza", count: 54, color: "#007BFF" },
    { name: "Otros", count: 58, color: "#007BFF" },
  ];

  return (
    <Card sx={{ height: "100%" }}>
      <CardHeader
        title={
          <Typography variant="h6">Distribución por Categorías</Typography>
        }
        sx={{ mb: 2 }}
      />
      <CardContent>
        {categories.map((category, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 3 }}
          >
            <Typography
              variant="body2"
              sx={{ width: "120px", color: "#6b7280" }}
            >
              {category.name}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                marginLeft: 2,
                backgroundColor: "#CCE5FF",
                height: "8px",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${(category.count / 145) * 100}%`, // Normalizado al máximo (145)
                  height: "100%",
                  backgroundColor: category.color,
                  transition: "width 0.3s ease-in-out",
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ marginLeft: 2, color: "#6b7280" }}
            >
              {category.count} productos
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default CategoryDistribution;
