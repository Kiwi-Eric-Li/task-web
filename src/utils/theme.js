import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#ce4257",
      contrastText: "#FFFFFF",
      fontWeight: "bold",
      iconColor: "rgb(38, 38, 38)"
    },
    secondary: {
      main: "#F5F5F5",
      contrastText: "#262626",
    },
    success: {
      main: '#00c853',
    },
    warning: {
      main: '#ff9800',
    },
    background: {
        default: "#FAFAFA",
        paper: "#FFFFFF",
    },
    text: {
        primary: "#262626",
        secondary: "#737373",
    },
    divider: "#E5E5E5",
    footer: {
      primary: "rgb(33, 37, 41)",
      copy: "rgba(0, 0, 0, 0.7)"
    }
  },
});

export default theme;