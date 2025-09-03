// src/app/(dashboard)/archivo/page.tsx
"use client";

import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { Add, Folder } from "@mui/icons-material";

export default function ArchivoPage() {
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
            Archivo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestión de expedientes y documentos
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Nuevo Expediente
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Folder sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Módulo de Archivo
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
