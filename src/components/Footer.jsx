import {
  Box,
  Paper,
  Typography
} from "@mui/material";

export default function Footer() {
  return (
    <Paper
      component="footer"
      elevation={0}
      sx={{
        bgcolor: "#004681",
        color: "white",
        borderRadius: "0 0 8px 8px",
        mx: { xs: 0, sm: 0 },
        mb: 2.75,
        minHeight: 103,
        px: { xs: 2, sm: 2.25 },
        py: 2.25,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        ARKA JAIN University
      </Typography>

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        Finance & Accounts Department
      </Typography>

      <Box
        sx={{
          borderTop: "1px solid rgba(255, 255, 255, 0.88)",
          mt: 1.15,
          mb: 0.9,
        }}
      />

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {"\u00a9"} 2026 ARKA JAIN University | Expense Management System
      </Typography>
    </Paper>
  );
}
