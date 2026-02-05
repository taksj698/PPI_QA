"use client";

import { Box, Stack, Avatar, Typography, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

type AppHeaderProps = {
  title: string;
  logoText?: string;
  onSearchClick?: () => void;
  onLogout?: () => void;
  themeColor?: string;
};

export default function AppHeader({
  title,
  logoText = "Q",
  onSearchClick,
  onLogout,
  themeColor = "#0B1C2D",
}: AppHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: themeColor,
        color: "white",
        px: { xs: 2, md: 3 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "white",
            color: themeColor,
            fontWeight: 900,
          }}
        >
          {logoText}
        </Avatar>

        <Typography
          variant="subtitle1"
          fontWeight={800}
          sx={{ letterSpacing: 0.5 }}
        >
          {title}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {onSearchClick && (
          <IconButton
            size="small"
            onClick={onSearchClick}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
            }}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        )}

        {onLogout && (
          <IconButton size="small" sx={{ color: "white" }} onClick={onLogout}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}
