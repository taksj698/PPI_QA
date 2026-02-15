"use client";

import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";
import { useAuth } from "@/features/login/useAuth";

export default function LoginPage() {
  const {
    userName,
    password,
    setUserName,
    setPassword,
    handleLogin,
    isLoading,
    error,
  } = useAuth();

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f0f2f5",
      }}
    >
      <Paper
        elevation={10}
        sx={{ p: 4, borderRadius: 5, textAlign: "center", width: 350 }}
      >
        <Avatar
          sx={{ m: "auto", bgcolor: "#1a237e", mb: 2, width: 56, height: 56 }}
        >
          <LockIcon fontSize="large" />
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          QC LOGIN
        </Typography>

        <TextField
          fullWidth
          label="ชื่อผู้ใช้งาน"
          sx={{ mb: 2 }}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <TextField
          fullWidth
          label="รหัสผ่าน"
          type="password"
          sx={{ mb: 3 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </Button>
      </Paper>
    </Box>
  );
}
