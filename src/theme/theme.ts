import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e",
    },
  },
  custom: {
    gradientHeader:
      "radial-gradient(circle farthest-corner at 50% 50%, #556b2f 50%, #6b8e23)",
  },
});

export default theme;