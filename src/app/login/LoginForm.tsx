"use client";

import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { LockOutlined as LockIcon } from "@mui/icons-material";

export default function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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
        <Typography variant="body2" color="textSecondary" sx={{ mb: 4 }}>
          ระบบประเมินคุณภาพสับปะรด (TS)
        </Typography>
        <TextField fullWidth label="ชื่อผู้ใช้งาน" sx={{ mb: 2 }} />
        <TextField fullWidth label="รหัสผ่าน" type="password" sx={{ mb: 3 }} />
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => setIsLoggedIn(true)}
          sx={{ borderRadius: 3, py: 1.5, fontWeight: "bold" }}
        >
          เข้าสู่ระบบ
        </Button>
      </Paper>
    </Box>
  );
}
