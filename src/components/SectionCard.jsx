import { Paper, Typography } from "@mui/material";

export default function SectionCard({ title, children }) {
  return (
    <Paper
      elevation={2}
      sx={{
        mt: 4,
        p: 4,
        position: "relative",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: -14,
          left: 20,
          bgcolor: "white",
          px: 1,
          color: "#0d4f95",
          fontWeight: 700,
          fontSize: 22,
        }}
      >
        {title}
      </Typography>

      {children}  
    </Paper>
  );
}