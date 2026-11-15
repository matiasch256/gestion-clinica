import { Box, LinearProgress, Typography } from "@mui/material";
import SectionCard from "./SectionCard";

const CATEGORIES = [
  { name: "Papelería", count: 145 },
  { name: "Tecnología", count: 89 },
  { name: "Mobiliario", count: 67 },
  { name: "Limpieza", count: 54 },
  { name: "Otros", count: 58 },
];

const CategoryDistribution = () => {
  const max = Math.max(...CATEGORIES.map((category) => category.count));

  return (
    <SectionCard title="Productos por categoría">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {CATEGORIES.map((category) => (
          <Box key={category.name}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="body2">{category.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {category.count}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(category.count / max) * 100}
              sx={{ height: 6, borderRadius: 3, bgcolor: "primary.lighter" }}
            />
          </Box>
        ))}
      </Box>
    </SectionCard>
  );
};

export default CategoryDistribution;
