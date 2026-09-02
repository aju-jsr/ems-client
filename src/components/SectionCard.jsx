import { Paper, Typography } from "@mui/material";

export default function SectionCard({ title, children }) {
  return (
    <Paper
      elevation={2}
      sx={{
        mt: { xs: 2, md: 4 },
        mx: { xs: 1, sm: 2, md: 0 },
        p: { xs: 1.5, sm: 2.5, md: 4 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: -14,
          left: { xs: 12, md: 20 },
          bgcolor: "white",
          px: 1,
          color: "#0d4f95",
          fontWeight: 700,
          fontSize: { xs: 16, sm: 18, md: 22 },
          maxWidth: "calc(100% - 24px)",
          overflowWrap: "anywhere",
        }}
      >
        {title}
      </Typography>

      {children}  
    </Paper>
  );
}
