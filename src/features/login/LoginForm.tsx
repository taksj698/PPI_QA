import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Fade,
} from "@mui/material";
import { 
  PersonOutlined, 
  LockOutlined, 
  VisibilityOutlined, 
  VisibilityOffOutlined,
  LoginOutlined
} from '@mui/icons-material';
import { useAuth } from "@/features/login/useAuth";
/**
 * Mocking the useAuth hook 
 * ในโปรเจคจริงให้ใช้: import { useAuth } from "@/features/login/useAuth";
 */
const useAuthMock = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return { userName, password, setUserName, setPassword, handleLogin, isLoading, error };
};

export default function App() {
  const {
    userName,
    password,
    setUserName,
    setPassword,
    handleLogin,
    isLoading,
    error,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  // สีตามโจทย์: radial-gradient(circle farthest-corner at 50% 50%, #556b2f 50%, #6b8e23)
  const darkGreen = "#556b2f";    
  const primaryGreen = "#6b8e23"; 
  const bgGradient = "radial-gradient(circle farthest-corner at 50% 50%, #556b2f 50%, #6b8e23)";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: bgGradient,
        p: 3,
      }}
    >
      <Fade in={true} timeout={1000}>
        <Container maxWidth="xs">
          {/* Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 4 
            }}
          >
            <Box
              component="img"
              src="https://cdn.prod.website-files.com/5f473a94183a537a7eb9fb3f/6160067654191bf8e868aa01_PPI-LOGO-WHITE.png"
              sx={{
                width: 200,
                height: 'auto',
                filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.2))',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 5 },
              borderRadius: '32px',
              textAlign: "center",
              bgcolor: "rgba(255, 255, 255, 0.98)", // เพิ่มความทึบเล็กน้อยให้อ่านง่ายขึ้น
              backdropFilter: "blur(10px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: 800, 
                color: darkGreen,
                mb: 1,
                letterSpacing: 1
              }}
            >
              QA SYSTEM
            </Typography>
            {/* <Typography 
              variant="body2" 
              sx={{ color: 'text.secondary', mb: 4, fontWeight: 500 }}
            >
              PRIME PRODUCTS INDUSTRY
            </Typography> */}

            {/* Form Section */}
            <Box component="form" noValidate>
              <TextField
                fullWidth
                placeholder="ชื่อผู้ใช้งาน"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlined sx={{ color: darkGreen }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2.5,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    // กำหนดเส้นขอบตอนปกติให้ชัดเจนขึ้น
                    '& fieldset': { 
                      border: '1.5px solid #e0e0e0',
                      transition: 'border-color 0.2s ease-in-out'
                    },
                    '&:hover fieldset': { 
                      borderColor: '#bdbdbd' 
                    },
                    '&.Mui-focused fieldset': { 
                      border: `2px solid ${primaryGreen}`,
                    },
                  }
                }}
              />

              <TextField
                fullWidth
                placeholder="รหัสผ่าน"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: darkGreen }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    backgroundColor: '#ffffff',
                    // กำหนดเส้นขอบตอนปกติให้ชัดเจนขึ้น
                    '& fieldset': { 
                      border: '1.5px solid #e0e0e0',
                      transition: 'border-color 0.2s ease-in-out'
                    },
                    '&:hover fieldset': { 
                      borderColor: '#bdbdbd' 
                    },
                    '&.Mui-focused fieldset': { 
                      border: `2px solid ${primaryGreen}`,
                    },
                  }
                }}
              />

              {error && (
                <Typography color="error" sx={{ mb: 3, fontSize: 14, fontWeight: 600 }}>
                  {error}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleLogin}
                disabled={isLoading}
                sx={{
                  py: 1.8,
                  borderRadius: '16px',
                  bgcolor: darkGreen,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 10px 20px -5px rgba(85, 107, 47, 0.5)',
                  '&:hover': {
                    bgcolor: primaryGreen,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 25px -5px rgba(107, 142, 35, 0.6)',
                  },
                  '&:active': { transform: 'translateY(0)' },
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
}