"use client";

import { Dialog, Box, Typography, Stack, Button } from "@mui/material";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  accentColor?: string;
  confirmColor?: string;
};

export default function ConfirmDialog({
  open,
  title = "ยืนยันการทำรายการ",
  description = "กรุณาตรวจสอบข้อมูลก่อนดำเนินการ",
  onCancel,
  onConfirm,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  accentColor = "#F59E0B",
  confirmColor = "#0B1C2D",
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: 3,
          py: 3,
          minWidth: 320,
        },
      }}
    >
      <Box textAlign="center">
        {/* Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            mx: "auto",
            mb: 1.5,
            borderRadius: "50%",
            bgcolor: `${accentColor}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HelpOutlineRoundedIcon sx={{ fontSize: 36, color: accentColor }} />
        </Box>

        {/* Title */}
        <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>
          {title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {description}
        </Typography>

        {/* Actions */}
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {cancelText}
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={onConfirm}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              bgcolor: confirmColor,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              "&:hover": {
                bgcolor: confirmColor,
                opacity: 0.9,
              },
            }}
          >
            {confirmText}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}