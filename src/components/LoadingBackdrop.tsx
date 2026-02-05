"use client";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

type LoadingBackdropProps = {
  open: boolean;
  text?: string;
};

export default function LoadingBackdrop({
  open,
  text = "กำลังส่งข้อมูลเข้าสู่ระบบ...",
}: LoadingBackdropProps) {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: 3000,
        flexDirection: "column",
        backdropFilter: "blur(4px)",
      }}
      open={open}
    >
      <CircularProgress color="inherit" size={50} />
      <Typography sx={{ mt: 2, fontWeight: 700 }}>{text}</Typography>
    </Backdrop>
  );
}
