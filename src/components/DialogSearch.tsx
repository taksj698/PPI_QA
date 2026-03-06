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
  Chip,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import BadgeIcon from "@mui/icons-material/Badge";
import { qcService } from "@/services/qc.service";
import { QcCheck, QcCheckResponse } from "@/types/qcCheck.type";
import ScaleIcon from "@mui/icons-material/Scale";
import { formatDateTime } from "@/utils/date";
import { InputAdornment } from "@mui/material";
export type Truck = {
  id: string | number;
  plate: string;
  supplier: string;
  time: string;
};

type TruckSearchDialogProps = {
  open: boolean;
  onClose: () => void;
  // searchQuery: string;
  // onSearchChange: (value: string) => void;
  // trucks: Truck[];
  onSelectTruck: (truck: QcCheck) => void;
  themeColor?: string;
};

export default function TruckSearchDialog({
  open,
  onClose,
  // onSearchChange,
  // trucks,
  onSelectTruck,
  themeColor = "#0B1C2D",
}: TruckSearchDialogProps) {

  const [trucks, setTrucks] = useState<QcCheck[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
useEffect(() => {
  if (!open) return;

  const fetchQcCheck = async () => {
    try {
      setLoading(true);

      const data: QcCheckResponse = await qcService.getQcCheck();

      if (data.isSuccess) {
        const fetched = Array.isArray(data.data) ? data.data : [data.data];
        setTrucks(fetched);
      }
    } catch (error) {
      console.error("Error fetching QC Check:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchQcCheck();
}, [open]);

  
  const filteredTrucks = React.useMemo(() => {
    return trucks.filter((t) =>
      `${t.plate ?? ""} ${t.companyName ?? ""} ${t.truckTypeName ?? ""}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [trucks, searchQuery]);



  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{
      paper: {
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          height: 'auto',
          maxHeight: '80vh'
        }
      }
    }}>
      <Box sx={{ bgcolor: themeColor, p: 3, color: "white" }}>
        <Typography variant="h6" fontWeight={800} mb={2}>
          เลือกคิวรถ
        </Typography>

        <TextField
          fullWidth
          placeholder="ค้นหา ทะเบียน, ลูกค้า..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255,255,255,0.1)",
              color: "white",
              borderRadius: 2,
              "& fieldset": { border: "none" },
            },
          }}
        />
      </Box>

      <DialogContent sx={{ p: 2, minHeight: 450, bgcolor: "#F8F9FA" }}>
        <Stack spacing={1.5}>
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            ))
          ) : filteredTrucks.length > 0 ? (
            filteredTrucks.map((t) => (
              <Card
                key={t.logid}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #E0E4E8",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderColor: themeColor
                  }
                }}
              >
                <CardActionArea
                  sx={{ p: 2 }}
                  onClick={() => {
                    onSelectTruck(t);
                    onClose();
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Stack spacing={0.5} sx={{ flex: 1 }}>
                      {/* ส่วนทะเบียนรถพร้อม Icon */}
                      <Stack direction="row" spacing={1} alignItems="center">
                        <BadgeIcon sx={{ color: "primary.main", fontSize: 20 }} />
                        <Typography variant="h6" fontWeight={900} color="primary" sx={{ lineHeight: 1.2 }}>
                          {t.plate}
                        </Typography>
                      </Stack>

                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ pl: 3.5 }}>
                        {t.companyName}
                      </Typography>
                    </Stack>

                    <Stack alignItems="flex-end">
                      <Box display="flex" alignItems="center" color={themeColor}>
                        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="subtitle2" fontWeight={800} sx={{ fontSize: '0.75rem' }}>
                          {t.inboundDate ? formatDateTime(t.inboundDate) : "-"}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled">
                        เวลาเข้าคิว
                      </Typography>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 1, borderStyle: 'dashed' }} />

                  {/* ส่วนการแสดงน้ำหนัก */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <ScaleIcon sx={{ fontSize: 16, color: "text.disabled" }} />
                        <Typography variant="caption" color="text.secondary">สุทธิ:</Typography>
                        <Typography variant="caption" fontWeight={800} color="success.main">
                          {t.grossWeight ? t.grossWeight.toLocaleString() + " กก." : "-"}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.disabled">
                        (เข้า: {t.inboundWeight ? t.inboundWeight.toLocaleString() : "-"} / ออก: {t.outboundWeight ? t.outboundWeight.toLocaleString() : "-"})
                      </Typography>
                    </Stack>

                    <Chip
                      size="small"
                      icon={<LocalShippingIcon style={{ fontSize: 12 }} />}
                      label={t.truckTypeName}
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.05)' }}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            ))
          ) : (
            <Box textAlign="center" py={10}>
              <SearchIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography color="text.secondary">ไม่พบข้อมูลที่ค้นหา</Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
