import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PageHeader from "../../common/PageHeader";
import SectionCard from "../../common/SectionCard";
import StatCard from "../../common/StatCard";
import EmptyState from "../../common/EmptyState";

export const ProveedoresDashBoard = () => {
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [ultimos, setUltimos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.length);
        setUltimos(data.slice(-5).reverse());
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar proveedores", err);
        setCargando(false);
      });
  }, []);

  return (
    <>
      <PageHeader
        title="Proveedores"
        subtitle="Resumen de proveedores registrados"
        actions={
          <>
            <Button onClick={() => navigate("/proveedores/consultar")}>
              Ver todos
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/proveedores/registrar")}
            >
              Registrar proveedor
            </Button>
          </>
        }
      />

      {cargando ? (
        <Skeleton variant="rounded" height={240} />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box>
              <StatCard
                title="Proveedores registrados"
                value={total}
                caption="Total en el sistema"
                icon={LocalShippingIcon}
              />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <SectionCard title="Últimos proveedores agregados" disablePadding>
              {ultimos.length === 0 ? (
                <EmptyState title="Todavía no hay proveedores registrados" />
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Teléfono</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ultimos.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell>{p.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {p.nombre}
                        </TableCell>
                        <TableCell>{p.telefono}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </SectionCard>
          </Grid>
        </Grid>
      )}
    </>
  );
};
