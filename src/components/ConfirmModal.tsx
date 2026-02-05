"use client";

import { Dialog, Box, Typography, Stack, Button } from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";

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
  title = "ยืนยันการส่งข้อมูล?",
  description = "ข้อมูลจะถูกบันทึกเข้าสู่ระบบของโรงงาน",
  onCancel,
  onConfirm,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  accentColor = "#F59E0B",
  confirmColor = "#0B1C2D",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <HelpIcon sx={{ fontSize: 60, color: accentColor, mb: 1 }} />

        <Typography variant="h6" fontWeight={900}>
          {title}
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button fullWidth onClick={onCancel}>
            {cancelText}
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={onConfirm}
            sx={{ bgcolor: confirmColor }}
          >
            {confirmText}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
