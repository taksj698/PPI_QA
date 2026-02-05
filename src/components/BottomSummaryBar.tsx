"use client";

import { Box, Container, Stack, Typography, Button } from "@mui/material";

type BottomSummaryBarProps = {
  visible: boolean;
  roundsCount: number;
  totalSamples: number;
  hasValidationError?: boolean;
  onSaveDraft?: () => void;
  onSubmit?: () => void;
  accentColor?: string;
  gradient?: string;
};

export default function BottomSummaryBar({
  visible,
  roundsCount,
  totalSamples,
  hasValidationError = false,
  onSaveDraft,
  onSubmit,
  accentColor = "#F59E0B",
  gradient = "linear-gradient(135deg, #0B1C2D, #1E3A8A)",
}: BottomSummaryBarProps) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid #DDD",
        zIndex: 1050,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={800}
              >
                รอบการตรวจ
              </Typography>
              <Typography variant="h5" fontWeight={900}>
                {roundsCount}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={800}
              >
                ยอดสุ่มรวม
              </Typography>
              <Typography variant="h5" fontWeight={900} color={accentColor}>
                {totalSamples}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: { xs: "100%", md: "400px" } }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={onSaveDraft}
              sx={{
                borderRadius: 3,
                fontWeight: 800,
                height: 50,
              }}
            >
              บันทึกร่าง
            </Button>

            <Button
              fullWidth
              variant="contained"
              onClick={onSubmit}
              disabled={hasValidationError}
              sx={{
                borderRadius: 3,
                fontWeight: 900,
                height: 50,
                background: gradient,
              }}
            >
              ส่งผลตรวจ
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
