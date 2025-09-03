// src/app/(dashboard)/correspondencia/page.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import {
  Add,
  TrendingUp,
  Schedule,
  Assignment,
  Warning,
  CheckCircle,
  Mail,
  Reply,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";

// Datos mock para el dashboard de correspondencia
const dashboardStats = [
  {
    title: "Total Correspondencia",
    value: "156",
    change: "+12%",
    changeType: "positive" as const,
    icon: <Mail />,
    color: "primary" as const,
  },
  {
    title: "Pendientes",
    value: "23",
    change: "-5%",
    changeType: "negative" as const,
    icon: <Schedule />,
    color: "warning" as const,
  },
  {
    title: "Vencidas",
    value: "8",
    change: "+2",
    changeType: "negative" as const,
    icon: <Warning />,
    color: "error" as const,
  },
  {
    title: "Completadas",
    value: "125",
    change: "+15%",
    changeType: "positive" as const,
    icon: <CheckCircle />,
    color: "success" as const,
  },
];

const recentCorrespondence = [
  {
    id: "1",
    folio: "2024-0045",
    subject: "Solicitud de información pública",
    sender: "Juan Pérez García",
    status: "routed",
    priority: "normal",
    dueDate: "2024-01-25",
    assignee: "Ana Martínez",
  },
  {
    id: "2",
    folio: "2024-0044",
    subject: "Recurso de revisión expediente 123/2023",
    sender: "María López Rodríguez",
    status: "inProgress",
    priority: "high",
    dueDate: "2024-01-23",
    assignee: "Luis Rodríguez",
  },
  {
    id: "3",
    folio: "2024-0043",
    subject: "Consulta sobre procedimiento administrativo",
    sender: "Carlos Sánchez",
    status: "answered",
    priority: "low",
    dueDate: "2024-01-28",
    assignee: "Patricia López",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "default";
    case "registered":
      return "info";
    case "routed":
      return "warning";
    case "inProgress":
      return "primary";
    case "answered":
      return "secondary";
    case "closed":
      return "success";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "draft":
      return "Borrador";
    case "registered":
      return "Registrada";
    case "routed":
      return "Turnada";
    case "inProgress":
      return "En Trámite";
    case "answered":
      return "Respondida";
    case "closed":
      return "Cerrada";
    default:
      return status;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "default";
    case "normal":
      return "info";
    case "high":
      return "warning";
    case "urgent":
      return "error";
    default:
      return "default";
  }
};

export default function CorrespondencePage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  console.log("Usuario actual:", user);
  console.log(theme.zIndex);

  const canCreateCorrespondence = hasPermission("correspondence", "create");

  const handleNewCorrespondence = () => {
    router.push("/correspondencia/nueva");
  };

  const handleViewCorrespondence = (id: string) => {
    router.push(`/correspondencia/${id}`);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Correspondencia
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestión integral de correspondencia y oficios
          </Typography>
        </Box>

        {canCreateCorrespondence && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleNewCorrespondence}
              size="large"
            >
              Nueva Correspondencia
            </Button>
          </Stack>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      gutterBottom
                      variant="body2"
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <TrendingUp
                        sx={{
                          fontSize: 16,
                          mr: 0.5,
                          color:
                            stat.changeType === "positive"
                              ? "success.main"
                              : "error.main",
                        }}
                      />
                      <Typography
                        variant="body2"
                        color={
                          stat.changeType === "positive"
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {stat.change}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        vs mes anterior
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 60,
                      height: 60,
                      borderRadius: 2,
                      backgroundColor: `${stat.color}.main`,
                      color: "white",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Correspondence */}
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Correspondencia Reciente</Typography>
          <Button
            variant="outlined"
            onClick={() => router.push("/correspondencia/lista")}
          >
            Ver Todas
          </Button>
        </Box>

        <Grid container spacing={2}>
          {recentCorrespondence.map((item) => (
            <Grid item xs={12} key={item.id}>
              <Card
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    borderColor: "primary.main",
                  },
                }}
                onClick={() => handleViewCorrespondence(item.id)}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Typography variant="subtitle2" color="primary">
                          {item.folio}
                        </Typography>
                        <Chip
                          size="small"
                          label={getStatusLabel(item.status)}
                          color={getStatusColor(item.status)}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={item.priority.toUpperCase()}
                          color={getPriorityColor(item.priority)}
                          variant="filled"
                        />
                      </Box>

                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {item.subject}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 3 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          <strong>De:</strong> {item.sender}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Asignado a:</strong> {item.assignee}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Vence:</strong> {item.dueDate}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Tooltip title="Responder">
                        <IconButton color="primary">
                          <Reply />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Asignar">
                        <IconButton color="default">
                          <Assignment />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {recentCorrespondence.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Mail sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay correspondencia reciente
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cuando se registre nueva correspondencia, aparecerá aquí.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
