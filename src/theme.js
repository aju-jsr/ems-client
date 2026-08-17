import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0d4f95",
    },
    background: {
      default: "#f4f6f9",
    },
  },

  typography: {
    fontFamily: "'Segoe UI', sans-serif",
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "small",
      },
    },

    MuiFormControl: {
      defaultProps: {
        fullWidth: true,
        size: "small",
      },
    },
  },
});

export default theme;