// src/app/(dashboard)/prestamos/page.tsx
"use client";

import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Add, Book } from "@mui/icons-material";

export default function PrestamosPage() {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Préstamos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Control de préstamos de documentos y expedientes
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Nuevo Préstamo
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Book sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Módulo de Préstamos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Esta funcionalidad se implementará en la siguiente fase.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
