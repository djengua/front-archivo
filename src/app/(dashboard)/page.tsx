// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { Mail, Folder } from "@mui/icons-material";

export default function DashboardPage() {
  return (
    <Box>
      sj
      <Typography variant="h4" gutterBottom>
        Dashboard Principal
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Mail color="primary" />
                <Box>
                  <Typography variant="h6">Correspondencia</Typography>
                  <Typography variant="h4">156</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Folder color="secondary" />
                <Box>
                  <Typography variant="h6">Expedientes</Typography>
                  <Typography variant="h4">89</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Folder color="success" />
                <Box>
                  <Typography variant="h6">Préstamos</Typography>
                  <Typography variant="h4">23</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
