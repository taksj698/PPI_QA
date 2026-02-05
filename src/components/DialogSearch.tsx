"use client";

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Stack,
  Skeleton,
  Card,
  CardActionArea,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export type Truck = {
  id: string | number;
  plate: string;
  supplier: string;
  time: string;
};

type TruckSearchDialogProps = {
  open: boolean;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
  trucks: Truck[];
  onSelectTruck: (truck: Truck) => void;
  themeColor?: string;
};

export default function TruckSearchDialog({
  open,
  onClose,
  searchQuery,
  onSearchChange,
  isSearching,
  trucks,
  onSelectTruck,
  themeColor = "#0B1C2D",
}: TruckSearchDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <Box sx={{ bgcolor: themeColor, p: 3, color: "white" }}>
        <Typography variant="h6" fontWeight={800} mb={2}>
          เลือกคิวรถ
        </Typography>

        <TextField
          fullWidth
          placeholder="ทะเบียน/สวน..."
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: "white", mr: 1 }} />,
            sx: {
              bgcolor: "rgba(255,255,255,0.1)",
              color: "white",
              borderRadius: 2,
              "& fieldset": { border: "none" },
            },
          }}
        />
      </Box>

      <DialogContent sx={{ p: 2, minHeight: 400 }}>
        <Stack spacing={1}>
          {isSearching
            ? [1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={70}
                  sx={{ borderRadius: 2 }}
                />
              ))
            : trucks.map((t) => (
                <Card key={t.id} variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardActionArea
                    sx={{ p: 2 }}
                    onClick={() => {
                      onSelectTruck(t);
                      onClose();
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2" fontWeight={900}>
                          {t.plate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.supplier}
                        </Typography>
                      </Box>
                      <Typography variant="caption" fontWeight={900}>
                        {t.time}
                      </Typography>
                    </Stack>
                  </CardActionArea>
                </Card>
              ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
