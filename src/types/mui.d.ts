import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      gradientHeader: string;
    };
  }

  interface ThemeOptions {
    custom?: {
      gradientHeader?: string;
    };
  }
}