"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Snackbar,
  Alert,
  Avatar,
  CardActionArea,
  MenuItem,
  Select,
  Divider,
  AlertColor,
} from "@mui/material";
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Search as SearchIcon,
  LocalShipping as TruckIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Scale as ScaleIcon,
  ArrowForwardIos as ArrowIcon,
  CheckCircle as CheckCircleIcon,
  WbSunny as SunIcon,
  BugReport as BugIcon,
  Grass as RipeIcon,
  ReportProblem as ProblemIcon,
  LockOutlined as LockIcon,
  Logout as LogoutIcon,
  HelpOutline as HelpIcon,
  Inventory as BoxIcon,
  Straighten as SizeIcon,
} from "@mui/icons-material";

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================

interface Truck {
  id: string;
  plate: string;
  weight: string;
  driver: string;
  type: string;
  time: string;
  supplier: string;
}

interface Criteria {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
}

interface Round {
  id: number;
  values: Record<string, number>;
  sampleCount: number;
}

interface AssessmentState {
  status: string;
}

// ==========================================
// 2. CONSTANTS & MOCK DATA
// ==========================================

const ASSESSMENT_CRITERIA: Criteria[] = [
  {
    id: "large",
    label: "ลูกใหญ่ (≥ 95 mm)",
    group: "ขนาด",
    icon: <SizeIcon sx={{ fontSize: 18, color: "#4caf50" }} />,
  },
  {
    id: "medium",
    label: "ลูกเล็ก (85 - 94 mm)",
    group: "ขนาด",
    icon: <SizeIcon sx={{ fontSize: 18, color: "#8bc34a" }} />,
  },
  {
    id: "small",
    label: "ลูกจิ๋ว (< 75-84 mm)",
    group: "ขนาด",
    icon: <SizeIcon sx={{ fontSize: 18, color: "#cddc39" }} />,
  },
  {
    id: "raw",
    label: "ดิบ",
    group: "ความสุก",
    icon: <RipeIcon sx={{ fontSize: 18, color: "#4caf50" }} />,
  },
  {
    id: "yellow1",
    label: "ปรากฎเหลือง (1-3 ตา)",
    group: "ความสุก",
    icon: <RipeIcon sx={{ fontSize: 18, color: "#ffeb3b" }} />,
  },
  {
    id: "yellow2",
    label: "ครึ่งลูกขึ้นไป",
    group: "ความสุก",
    icon: <RipeIcon sx={{ fontSize: 18, color: "#ffc107" }} />,
  },
  {
    id: "rotten",
    label: "ช้ำ > 30%, ไส้เน่า",
    group: "ตำหนิ",
    icon: <ProblemIcon sx={{ fontSize: 18, color: "#f44336" }} />,
  },
  {
    id: "crack",
    label: "แตก/ร้าว",
    group: "ตำหนิ",
    icon: <ProblemIcon sx={{ fontSize: 18, color: "#ff5722" }} />,
  },
  {
    id: "sunburn",
    label: "แดดเผา",
    group: "ตำหนิ",
    icon: <SunIcon sx={{ fontSize: 18, color: "#ff9800" }} />,
  },
  {
    id: "fungus",
    label: "เชื้อรา",
    group: "ตำหนิ",
    icon: <BugIcon sx={{ fontSize: 18, color: "#9c27b0" }} />,
  },
  {
    id: "insect",
    label: "แมลง/เพลี้ย",
    group: "ตำหนิ",
    icon: <BugIcon sx={{ fontSize: 18, color: "#795548" }} />,
  },
];

const MOCK_TRUCKS: Truck[] = [
  {
    id: "T001",
    plate: "82-6989",
    weight: "9,570",
    driver: "สมชาย มั่นคง",
    type: "รถ 6 ล้อ",
    time: "08:30",
    supplier: "สวนกำนันเปี๊ยก",
  },
  {
    id: "T002",
    plate: "70-1234",
    weight: "12,000",
    driver: "วิชัย รักดี",
    type: "รถ 10 ล้อ",
    time: "09:15",
    supplier: "ไร่รวมทรัพย์",
  },
  {
    id: "T003",
    plate: "ผก-555",
    weight: "4,500",
    driver: "อำนาจ ชูใจ",
    type: "รถกระบะ",
    time: "10:00",
    supplier: "เกษตรเจริญผล",
  },
  {
    id: "T004",
    plate: "77-8888",
    weight: "15,200",
    driver: "สมพงษ์ ยิ้มแย้ม",
    type: "รถพ่วง",
    time: "10:30",
    supplier: "สวนมาลี",
  },
];

// ==========================================
// 3. CUSTOM HOOKS
// ==========================================

const useAssessment = () => {
  const [rounds, setRounds] = useState<Round[]>(() => [
    { id: Date.now(), values: {}, sampleCount: 10 },
  ]);

  const [rowRemarks, setRowRemarks] = useState<Record<string, string>>({});
  const [headerInfo, setHeaderInfo] = useState<AssessmentState>({
    status: "New",
  });

  const updateValue = useCallback(
    (roundId: number, criteriaId: string, value: string) => {
      const val = parseInt(value);
      setRounds((prev) =>
        prev.map((r) =>
          r.id === roundId
            ? {
                ...r,
                values: { ...r.values, [criteriaId]: isNaN(val) ? 0 : val },
              }
            : r,
        ),
      );
    },
    [],
  );

  const updateSampleCount = useCallback((roundId: number, count: number) => {
    setRounds((prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, sampleCount: count } : r)),
    );
  }, []);

  const addRound = useCallback(() => {
    setRounds((prev) => [
      ...prev,
      { id: Date.now(), values: {}, sampleCount: 10 },
    ]);
  }, []);

  const removeRound = useCallback((roundId: number) => {
    setRounds((prev) =>
      prev.length > 1 ? prev.filter((r) => r.id !== roundId) : prev,
    );
  }, []);

  const updateRemark = useCallback((criteriaId: string, value: string) => {
    setRowRemarks((prev) => ({ ...prev, [criteriaId]: value }));
  }, []);

  const totals = useMemo(() => {
    const summary: Record<string, number> = {};
    ASSESSMENT_CRITERIA.forEach((c) => {
      summary[c.id] = rounds.reduce(
        (sum, round) => sum + (round.values[c.id] || 0),
        0,
      );
    });
    return summary;
  }, [rounds]);

  const totalSamples = useMemo(
    () => rounds.reduce((sum, r) => sum + r.sampleCount, 0),
    [rounds],
  );

  return {
    rounds,
    addRound,
    removeRound,
    updateValue,
    updateSampleCount,
    rowRemarks,
    updateRemark,
    totals,
    totalSamples,
    headerInfo,
    setHeaderInfo,
  };
};

// ==========================================
// 4. SUB-COMPONENTS
// ==========================================

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (truck: Truck) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const TruckSearchDialog: React.FC<SearchDialogProps> = ({
  open,
  onClose,
  onSelect,
  searchTerm,
  setSearchTerm,
}) => {
  const filteredTrucks = MOCK_TRUCKS.filter(
    (truck) =>
      truck.plate.includes(searchTerm) ||
      truck.driver.includes(searchTerm) ||
      truck.supplier.includes(searchTerm),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 4, bgcolor: "#f8f9fa", overflow: "hidden" },
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 0, bgcolor: "white" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#1a237e" }}>
            เลือกคิวรถประเมิน
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ bgcolor: "#f5f5f5" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          placeholder="ค้นหาทะเบียน, ชื่อคนขับ, หรือแหล่งที่มา..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "#1a237e" }} />,
            sx: { borderRadius: 3, bgcolor: "#f8f9fa" },
          }}
          sx={{ mb: 3, mt: 1 }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 1, maxHeight: "60vh" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {filteredTrucks.length > 0 ? (
            filteredTrucks.map((t) => (
              <Card
                key={t.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  transition: "0.2s",
                  bgcolor: "white",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 15px rgba(0,0,0,0.06)",
                    borderColor: "#1a237e",
                  },
                }}
              >
                <CardActionArea sx={{ p: 2 }} onClick={() => onSelect(t)}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid>
                      <Avatar
                        sx={{
                          bgcolor: "#e8eaf6",
                          color: "#1a237e",
                          width: 48,
                          height: 48,
                        }}
                      >
                        <TruckIcon />
                      </Avatar>
                    </Grid>
                    <Grid size={12}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 900, lineHeight: 1.1 }}
                        >
                          {t.plate}
                        </Typography>
                        <Chip
                          label={t.type}
                          size="small"
                          variant="outlined"
                          sx={{ height: 18, fontSize: "9px", fontWeight: 800 }}
                        />
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.3,
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: 13, color: "text.disabled" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {t.driver}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.3,
                          }}
                        >
                          <ScaleIcon
                            sx={{ fontSize: 13, color: "text.disabled" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ color: "text.secondary" }}
                          >
                            {t.weight} kg
                          </Typography>
                        </Box>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#1a237e",
                          fontWeight: 700,
                          mt: 0.5,
                          display: "block",
                        }}
                      >
                        📍 {t.supplier}
                      </Typography>
                    </Grid>
                    <Grid>
                      <ArrowIcon sx={{ fontSize: 16, color: "#ccc" }} />
                    </Grid>
                  </Grid>
                </CardActionArea>
              </Card>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography color="textSecondary">ไม่พบข้อมูลที่ค้นหา</Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2, bgcolor: "#fff" }}>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{ mr: "auto", ml: 1 }}
        >
          ผลลัพธ์: {filteredTrucks.length} รายการ
        </Typography>
        <Button onClick={onClose} sx={{ fontWeight: "bold" }}>
          ปิด
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface TruckInfoCardProps {
  selectedTruck: Truck;
  status: string;
  onAddRound: () => void;
}

const TruckInfoCard: React.FC<TruckInfoCardProps> = ({
  selectedTruck,
  status,
  onAddRound,
}) => (
  <Paper sx={{ p: 2, mb: 2, borderRadius: 3, borderLeft: "6px solid #1a237e" }}>
    <Grid container spacing={2} alignItems="center">
      <Grid size={{ xs: 12, md: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TruckIcon color="primary" />
          <Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", lineHeight: 1 }}
            >
              ทะเบียนรถ
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              {selectedTruck.plate}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon color="primary" />
          <Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", lineHeight: 1 }}
            >
              แหล่งที่มา / สวน
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {selectedTruck.supplier}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircleIcon color="primary" />
          <Box>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ display: "block", lineHeight: 1 }}
            >
              สถานะการตรวจ
            </Typography>
            <Chip
              label={status}
              color={status.includes("Draft") ? "warning" : "primary"}
              size="small"
              sx={{ height: 20, fontSize: "10px" }}
            />
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: "right" }}>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onAddRound}
          sx={{ borderRadius: 2 }}
        >
          เพิ่มรอบการสุ่ม
        </Button>
      </Grid>
    </Grid>
  </Paper>
);

interface TableProps {
  rounds: Round[];
  totals: Record<string, number>;
  totalSamples: number;
  rowRemarks: Record<string, string>;
  onValueChange: (rid: number, cid: string, val: string) => void;
  onSampleChange: (rid: number, val: number) => void;
  onRemarkChange: (cid: string, val: string) => void;
  onRemoveRound: (rid: number) => void;
}

const AssessmentTable: React.FC<TableProps> = ({
  rounds,
  totals,
  totalSamples,
  rowRemarks,
  onValueChange,
  onSampleChange,
  onRemarkChange,
  onRemoveRound,
}) => (
  <TableContainer
    component={Paper}
    sx={{
      borderRadius: 3,
      overflowX: "auto",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <Table size="small" sx={{ minWidth: 900 }}>
      <TableHead sx={{ bgcolor: "#f8f9fa" }}>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: "bold",
              width: "240px",
              position: "sticky",
              left: 0,
              bgcolor: "#f8f9fa",
              zIndex: 10,
              borderRight: "2px solid #e0e0e0",
            }}
          >
            รายการประเมินคุณภาพ
          </TableCell>
          {rounds.map((r, i) => (
            <TableCell
              key={r.id}
              align="center"
              sx={{ fontWeight: "bold", minWidth: "100px" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 0.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 22,
                    height: 22,
                    fontSize: 10,
                    bgcolor: "#1a237e",
                    mr: 0.5,
                  }}
                >
                  R{i + 1}
                </Avatar>
                <IconButton
                  size="small"
                  onClick={() => onRemoveRound(r.id)}
                  disabled={rounds.length === 1}
                  sx={{ color: "error.main" }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
              <Select
                size="small"
                value={r.sampleCount}
                onChange={(e) => onSampleChange(r.id, Number(e.target.value))}
                sx={{
                  height: 25,
                  fontSize: "11px",
                  borderRadius: 1.5,
                  minWidth: 65,
                }}
              >
                {[5, 10, 15, 20].map((v) => (
                  <MenuItem key={v} value={v}>
                    สุ่ม {v}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          ))}
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", bgcolor: "#e3f2fd", color: "#1a237e" }}
          >
            รวม (ลูก)
          </TableCell>
          <TableCell
            align="center"
            sx={{ fontWeight: "bold", bgcolor: "#fffde7", color: "#f57f17" }}
          >
            %
          </TableCell>
          <TableCell sx={{ fontWeight: "bold", minWidth: "220px" }}>
            หมายเหตุ
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {ASSESSMENT_CRITERIA.map((c) => (
          <TableRow key={c.id} hover>
            <TableCell
              sx={{
                position: "sticky",
                left: 0,
                bgcolor: "white",
                zIndex: 5,
                borderRight: "2px solid #f0f0f0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {c.icon}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                  >
                    {c.label}
                  </Typography>
                  <Typography variant="caption" color="textDisabled">
                    {c.group}
                  </Typography>
                </Box>
              </Box>
            </TableCell>
            {rounds.map((r) => (
              <TableCell key={r.id} align="center">
                <input
                  type="number"
                  style={{
                    width: "50px",
                    textAlign: "center",
                    borderRadius: "6px",
                    border: "1px solid #e0e0e0",
                    padding: "4px",
                  }}
                  value={r.values[c.id] || ""}
                  onChange={(e) => onValueChange(r.id, c.id, e.target.value)}
                />
              </TableCell>
            ))}
            <TableCell
              align="center"
              sx={{ fontWeight: 800, bgcolor: "#f1f8fe" }}
            >
              {totals[c.id]}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 900,
                color: totals[c.id] > 0 ? "error.main" : "text.disabled",
                bgcolor: "#fffdf2",
              }}
            >
              {totalSamples > 0
                ? ((totals[c.id] / totalSamples) * 100).toFixed(1)
                : 0}
              %
            </TableCell>
            <TableCell>
              <TextField
                fullWidth
                size="small"
                placeholder="..."
                value={rowRemarks[c.id] || ""}
                onChange={(e) => onRemarkChange(c.id, e.target.value)}
                InputProps={{ sx: { fontSize: "12px", borderRadius: 2 } }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const assessment = useAssessment();

  // UI Control
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: string;
    data: number | null;
  }>({ open: false, type: "", data: null });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "success" });

  const handleActionConfirm = () => {
    const { type } = confirmDialog;
    if (type === "DELETE_ROUND" && confirmDialog.data !== null) {
      assessment.removeRound(confirmDialog.data);
      setSnackbar({ open: true, message: "ลบรอบสำเร็จ", severity: "info" });
    } else if (type === "SAVE_DRAFT") {
      assessment.setHeaderInfo({ status: "Draft Saved" });
      setSnackbar({
        open: true,
        message: "บันทึกร่างสำเร็จ",
        severity: "success",
      });
    } else if (type === "SUBMIT") {
      assessment.setHeaderInfo({ status: "Submitted" });
      setSnackbar({
        open: true,
        message: "ส่งผลการตรวจเรียบร้อยแล้ว",
        severity: "success",
      });
    }
    setConfirmDialog({ open: false, type: "", data: null });
  };

  const handleSelectTruck = (truck: Truck) => {
    setSelectedTruck(truck);
    setOpenSearch(false);
    setSearchTerm("");
    assessment.setHeaderInfo({ status: "In Progress" });
  };

  return (
    <Box sx={{ bgcolor: "#f4f6f8", minHeight: "100vh", pb: 15 }}>
      {/* Navbar */}
      <Box
        sx={{
          bgcolor: "#1a237e",
          color: "white",
          py: 1.5,
          px: 2,
          mb: 3,
          boxShadow: 2,
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "white", width: 32, height: 32 }}>
              <AssessmentIcon sx={{ color: "#1a237e", fontSize: 20 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              QC PINEAPPLE
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              color="inherit"
              onClick={() => setOpenSearch(true)}
              startIcon={<TruckIcon />}
              sx={{ bgcolor: "rgba(255,255,255,0.1)", borderRadius: 2, px: 2 }}
            >
              {selectedTruck ? selectedTruck.plate : "เลือกรถ"}
            </Button>
            <IconButton color="inherit" onClick={() => setIsLoggedIn(false)}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {selectedTruck ? (
          <>
            <TruckInfoCard
              selectedTruck={selectedTruck}
              status={assessment.headerInfo.status}
              onAddRound={assessment.addRound}
            />

            <AssessmentTable
              rounds={assessment.rounds}
              totals={assessment.totals}
              totalSamples={assessment.totalSamples}
              rowRemarks={assessment.rowRemarks}
              onValueChange={assessment.updateValue}
              onSampleChange={assessment.updateSampleCount}
              onRemarkChange={assessment.updateRemark}
              onRemoveRound={(id) =>
                setConfirmDialog({ open: true, type: "DELETE_ROUND", data: id })
              }
            />
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 12 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#e8eaf6",
                color: "#1a237e",
                mx: "auto",
                mb: 3,
              }}
            >
              <TruckIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, mb: 1, color: "#1a237e" }}
            >
              พร้อมเริ่มงาน
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 4 }}>
              กรุณาเลือกรถจากคิวชั่งเพื่อเริ่มบันทึกข้อมูล
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => setOpenSearch(true)}
              startIcon={<SearchIcon />}
              sx={{ borderRadius: 5, px: 6, py: 1.5, fontWeight: "bold" }}
            >
              ค้นหาคิวรถ
            </Button>
          </Box>
        )}
      </Container>

      {/* Floating Action Bar */}
      {selectedTruck && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: 1000,
            bgcolor: "white",
            p: 2,
            borderRadius: 5,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1000,
            border: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1a237e" }}>
              <BoxIcon />
            </Avatar>
            <Box>
              <Typography variant="caption" color="textSecondary">
                ยอดสุ่มรวม
              </Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 900 }}>
                {assessment.totalSamples} ลูก
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              startIcon={<SaveIcon />}
              color="warning"
              variant="outlined"
              onClick={() =>
                setConfirmDialog({ open: true, type: "SAVE_DRAFT", data: null })
              }
              sx={{ borderRadius: 3, fontWeight: "bold" }}
            >
              บันทึกร่าง
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={() =>
                setConfirmDialog({ open: true, type: "SUBMIT", data: null })
              }
              sx={{
                borderRadius: 3,
                px: 4,
                fontWeight: "bold",
                bgcolor: "#1a237e",
              }}
            >
              ส่งผลตรวจ
            </Button>
          </Box>
        </Box>
      )}

      {/* Search Dialog */}
      <TruckSearchDialog
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSelect={handleSelectTruck}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, type: "", data: null })}
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor:
                confirmDialog.type === "SAVE_DRAFT"
                  ? "#fff9c4"
                  : confirmDialog.type === "SUBMIT"
                    ? "#e8eaf6"
                    : "#ffebee",
              color:
                confirmDialog.type === "SAVE_DRAFT"
                  ? "#f57f17"
                  : confirmDialog.type === "SUBMIT"
                    ? "#1a237e"
                    : "#d32f2f",
            }}
          >
            {confirmDialog.type === "SAVE_DRAFT" ? (
              <SaveIcon />
            ) : confirmDialog.type === "SUBMIT" ? (
              <HelpIcon />
            ) : (
              <ProblemIcon />
            )}
          </Avatar>
          <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
            {confirmDialog.type === "SAVE_DRAFT"
              ? "ยืนยันบันทึกร่าง"
              : confirmDialog.type === "SUBMIT"
                ? "ยืนยันส่งผลตรวจ"
                : "ยืนยันลบข้อมูล"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.type === "SAVE_DRAFT"
              ? "ข้อมูลจะถูกเก็บไว้เพื่อกลับมาแก้ไขภายหลัง"
              : confirmDialog.type === "SUBMIT"
                ? "เมื่อส่งแล้วจะไม่สามารถแก้ไขข้อมูลชุดนี้ได้อีก"
                : "ข้อมูลในรอบการสุ่มนี้จะหายไปทั้งหมด"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, type: "", data: null })
            }
            color="inherit"
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={handleActionConfirm}
            sx={{
              borderRadius: 2,
              px: 3,
              fontWeight: "bold",
              bgcolor:
                confirmDialog.type === "SAVE_DRAFT"
                  ? "#f57f17"
                  : confirmDialog.type === "DELETE_ROUND"
                    ? "#d32f2f"
                    : "#1a237e",
            }}
          >
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
