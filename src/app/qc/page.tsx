"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Avatar,
  MenuItem,
  Select,
  Stack,
  Chip,
  Button,
  InputBase,
  Dialog,
  CircularProgress,
  Backdrop,
  Fade,
  Skeleton,
  CardActionArea,
  Card,
  TextField,
  DialogContent,
  SelectChangeEvent,
} from "@mui/material";
import {
  Add as AddIcon,
  LocalShipping as TruckIcon,
  Logout as LogoutIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  HelpOutline as HelpIcon,
  Layers as LayersIcon,
  Straighten as StraightenIcon,
  Grass as GrassIcon,
  WbSunny as SunIcon,
  ReportProblem as WarningIcon,
  Coronavirus as FungusIcon,
  WaterDrop as WaterDropIcon,
  Block as BlockIcon,
  CheckCircle as SuccessIcon,
  RemoveCircle as WasteIcon,
  ChangeHistory as DeformedIcon,
  BugReport as BugIcon,
  Grain as SeedIcon,
  Adjust as HollowIcon,
} from "@mui/icons-material";
import LoadingBackdrop from "@/src/components/LoadingBackdrop";
import DialogSearch from "@/src/components/DialogSearch";
import ConfirmDialog from "@/src/components/ConfirmModal";
import AppHeader from "@/src/components/AppHeader";
import BottomSummaryBar from "@/src/components/BottomSummaryBar";

// --- Interfaces & Types ---

interface AssessmentCriteria {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
}

interface TruckQueue {
  id: string;
  plate: string;
  supplier: string;
  time: string;
  weight: string;
  type: string;
}

interface Round {
  id: number;
  name: string;
}

interface ValuesState {
  [key: string]: string;
}

interface RemarksState {
  [key: string]: string;
}

// --- Configuration ---
const THEME_NAVY = "#1A237E";
const THEME_BLUE_LIGHT = "#E3F2FD";
const THEME_ACCENT = "#2962FF";
const THEME_GRADIENT = "linear-gradient(135deg, #1A237E 0%, #2962FF 100%)";

const ASSESSMENT_CRITERIA: AssessmentCriteria[] = [
  {
    id: "size_large",
    label: "ลูกใหญ่ (≥ 95 mm)",
    group: "ขนาด",
    icon: <StraightenIcon fontSize="small" color="primary" />,
  },
  {
    id: "size_medium",
    label: "ลูกเล็ก (85 - 94 mm)",
    group: "ขนาด",
    icon: <StraightenIcon fontSize="small" color="primary" />,
  },
  {
    id: "size_small",
    label: "ลูกจิ๋ว (< 75-84 mm)",
    group: "ขนาด",
    icon: <StraightenIcon fontSize="small" color="primary" />,
  },
  {
    id: "ripe_raw",
    label: "ดิบ",
    group: "ความสุก",
    icon: <GrassIcon fontSize="small" sx={{ color: "#4CAF50" }} />,
  },
  {
    id: "ripe_yellow1",
    label: "ปรากฎเหลือง (1-3 ตา)",
    group: "ความสุก",
    icon: <GrassIcon fontSize="small" sx={{ color: "#FFEB3B" }} />,
  },
  {
    id: "ripe_half",
    label: "ครึ่งลูกขึ้นไป",
    group: "ความสุก",
    icon: <GrassIcon fontSize="small" sx={{ color: "#FFC107" }} />,
  },
  {
    id: "def_stunted_less",
    label: "แกร็น < 30%",
    group: "ตำหนิ",
    icon: <WarningIcon fontSize="small" sx={{ color: "#FF9800" }} />,
  },
  {
    id: "def_stunted_more",
    label: "แกร็น > 30%",
    group: "ตำหนิ",
    icon: <WarningIcon fontSize="small" sx={{ color: "#F44336" }} />,
  },
  {
    id: "def_bruised_less",
    label: "ช้ำ < 30%",
    group: "ตำหนิ",
    icon: <WaterDropIcon fontSize="small" sx={{ color: "#9C27B0" }} />,
  },
  {
    id: "def_bruised_mid",
    label: "ช้ำ > 30-50%",
    group: "ตำหนิ",
    icon: <WaterDropIcon fontSize="small" sx={{ color: "#7B1FA2" }} />,
  },
  {
    id: "def_bruised_more",
    label: "ช้ำ > 50%",
    group: "ตำหนิ",
    icon: <WaterDropIcon fontSize="small" sx={{ color: "#4A148C" }} />,
  },
  {
    id: "def_sunburn",
    label: "แดดเผา",
    group: "ตำหนิ",
    icon: <SunIcon fontSize="small" sx={{ color: "#FF5722" }} />,
  },
  {
    id: "def_hollow",
    label: "เนื้อโพรง",
    group: "ตำหนิ",
    icon: <HollowIcon fontSize="small" sx={{ color: "#795548" }} />,
  },
  {
    id: "def_rotten",
    label: "เน่า",
    group: "ตำหนิ",
    icon: <BlockIcon fontSize="small" color="error" />,
  },
  {
    id: "def_fungus",
    label: "เชื้อรา",
    group: "ตำหนิ",
    icon: <FungusIcon fontSize="small" sx={{ color: "#607D8B" }} />,
  },
  {
    id: "def_seed",
    label: "เมล็ด",
    group: "ตำหนิ",
    icon: <SeedIcon fontSize="small" sx={{ color: "#212121" }} />,
  },
  {
    id: "def_deformed",
    label: "รูปร่างผิดปกติ",
    group: "ตำหนิ",
    icon: <DeformedIcon fontSize="small" sx={{ color: "#9E9E9E" }} />,
  },
  {
    id: "def_pest",
    label: "สิ่งปนเปื้อน/สัตว์กัดแทะ",
    group: "ตำหนิ",
    icon: <BugIcon fontSize="small" sx={{ color: "#3E2723" }} />,
  },
  {
    id: "def_fraud",
    label: "พันธุ์อื่น (Food Fraud)",
    group: "ตำหนิ",
    icon: <BlockIcon fontSize="small" color="error" />,
  },
  {
    id: "summary_good",
    label: "จำนวนลูกที่เป็นของดี",
    group: "สรุปจำนวนลูก (รวม)",
    icon: <SuccessIcon fontSize="small" color="success" />,
  },
  {
    id: "summary_minor",
    label: "จำนวนลูกที่มีแกร็น <30% ช้ำ <30%",
    group: "สรุปจำนวนลูก (รวม)",
    icon: <WarningIcon fontSize="small" sx={{ color: "#FFC107" }} />,
  },
  {
    id: "summary_waste",
    label: "จำนวนลูกที่เป็นของเสีย (*)",
    group: "สรุปจำนวนลูก (รวม)",
    icon: <WasteIcon fontSize="small" color="error" />,
  },
];

const GROUPS: string[] = ["ขนาด", "ความสุก", "ตำหนิ", "สรุปจำนวนลูก (รวม)"];

const MOCK_TRUCKS: TruckQueue[] = [
  {
    id: "T001",
    plate: "82-6989",
    supplier: "สวนกำนันเปี๊ยก",
    time: "08:30",
    weight: "9.5 ตัน",
    type: "6 ล้อ",
  },
  {
    id: "T002",
    plate: "70-1234",
    supplier: "ไร่รวมทรัพย์",
    time: "09:15",
    weight: "12.0 ตัน",
    type: "10 ล้อ",
  },
  {
    id: "T003",
    plate: "ผก-555",
    supplier: "เกษตรเจริญผล",
    time: "10:00",
    weight: "4.2 ตัน",
    type: "กระบะ",
  },
  {
    id: "T004",
    plate: "บพ-888",
    supplier: "สวนนายเก่ง",
    time: "10:30",
    weight: "8.8 ตัน",
    type: "6 ล้อ",
  },
  {
    id: "T005",
    plate: "กข-111",
    supplier: "ไร่แสงจันทร์",
    time: "11:00",
    weight: "10.2 ตัน",
    type: "10 ล้อ",
  },
];

const App: React.FC = () => {
  const [selectedTruck, setSelectedTruck] = useState<TruckQueue | null>(null);
  const [globalSampleCount, setGlobalSampleCount] = useState<number>(10);
  const [rounds, setRounds] = useState<Round[]>(() => [
    { id: Date.now(), name: "R1" },
  ]);
  const [values, setValues] = useState<ValuesState>({});
  const [rowRemarks, setRowRemarks] = useState<RemarksState>({});

  // UI States
  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter trucks based on search
  const filteredTrucks = useMemo(() => {
    return MOCK_TRUCKS.filter(
      (t) =>
        t.plate.includes(searchQuery) ||
        t.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  // Simulation for Skeleton Loading
  useEffect(() => {
    if (openSearch) {
      const timer = setTimeout(() => setIsSearching(false), 800);
      return () => clearTimeout(timer);
    }
  }, [openSearch]);

  const handleValueChange = (
    roundId: number,
    criteriaId: string,
    val: string,
  ) => {
    setValues((prev) => ({ ...prev, [`${roundId}_${criteriaId}`]: val }));
  };

  const getNumericValue = (roundId: number, criteriaId: string): number => {
    const val = values[`${roundId}_${criteriaId}`];
    return val === "" || val === undefined ? 0 : parseFloat(val) || 0;
  };

  const getRoundTotalForGroup = (
    roundId: number,
    groupName: string,
  ): number => {
    return ASSESSMENT_CRITERIA.filter((c) => c.group === groupName).reduce(
      (sum, c) => sum + getNumericValue(roundId, c.id),
      0,
    );
  };

  const getRowTotal = (criteriaId: string): number => {
    return rounds.reduce(
      (sum, r) => sum + getNumericValue(r.id, criteriaId),
      0,
    );
  };

  const targetLimit = globalSampleCount;
  const totalSamplesOverall = rounds.length * targetLimit;

  const hasValidationError = useMemo(() => {
    return rounds.some((r) =>
      GROUPS.some((g) => getRoundTotalForGroup(r.id, g) > targetLimit + 0.001),
    );
  }, [rounds, values, targetLimit, getRoundTotalForGroup]);

  const handleSubmit = async () => {
    setConfirmOpen(false);
    setIsLoading(true);
    // Simulate API Call
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setSelectedTruck(null);
    setRounds([{ id: Date.now(), name: "R1" }]);
    setValues({});
    setSearchQuery("");
  };

  const handleSampleCountChange = (event: SelectChangeEvent<number>) => {
    setGlobalSampleCount(Number(event.target.value));
  };

  return (
    <Box
      sx={{
        bgcolor: "#F4F7F9",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        pb: { xs: 25, md: 18 },
      }}
    >
      <LoadingBackdrop open={isLoading} text="กำลังส่งข้อมูลเข้าสู่ระบบ..." />

      {/* Navbar */}
      <AppHeader
        title="QC PINEAPPLE (TS)"
        logoText="Q"
        onSearchClick={() => setOpenSearch(true)}
        onLogout={() => window.location.reload()}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        {!selectedTruck ? (
          <Fade in>
            <Box sx={{ textAlign: "center", py: 15 }}>
              <TruckIcon
                sx={{ fontSize: 100, color: "rgba(0,0,0,0.05)", mb: 2 }}
              />
              <Typography variant="h5" fontWeight={800} gutterBottom>
                ระบบประเมินคุณภาพหน้าโรงงาน
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 4 }}>
                กรุณาเลือกคิวรถเพื่อเริ่มบันทึกข้อมูลผลการตรวจ
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<SearchIcon />}
                onClick={() => setOpenSearch(true)}
                sx={{
                  borderRadius: 10,
                  px: 6,
                  py: 1.5,
                  bgcolor: THEME_ACCENT,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 20px rgba(41, 98, 255, 0.3)",
                }}
              >
                ค้นหาคิวรถ
              </Button>
            </Box>
          </Fade>
        ) : (
          <>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid #E0E0E0",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 2,
                mb: 2,
                bgcolor: "white",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ flexGrow: 1, minWidth: 250 }}
              >
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: THEME_BLUE_LIGHT,
                    color: THEME_ACCENT,
                  }}
                >
                  <TruckIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    fontWeight={700}
                  >
                    ทะเบียน / ผู้ส่ง
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight={900}
                    color={THEME_NAVY}
                    sx={{ lineHeight: 1.2 }}
                  >
                    {selectedTruck.plate} — {selectedTruck.supplier}
                  </Typography>
                </Box>
              </Stack>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ minWidth: 180 }}
              >
                <Box sx={{ p: 1, bgcolor: "#FFF3E0", borderRadius: 2 }}>
                  <LayersIcon sx={{ color: "#EF6C00" }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    fontWeight={700}
                  >
                    สุ่มรอบละ (ลูก)
                  </Typography>
                  <Select
                    size="small"
                    value={globalSampleCount}
                    onChange={handleSampleCountChange}
                    variant="standard"
                    disableUnderline
                    sx={{
                      fontWeight: 900,
                      color: "#EF6C00",
                      fontSize: "1.1rem",
                      ml: 0.5,
                    }}
                  >
                    {[5, 10, 15, 20].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val} ลูก
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() =>
                  setRounds([
                    ...rounds,
                    { id: Date.now(), name: `R${rounds.length + 1}` },
                  ])
                }
                sx={{
                  borderRadius: 3,
                  fontWeight: 800,
                  px: 3,
                  height: 45,
                  borderColor: THEME_ACCENT,
                  color: THEME_ACCENT,
                }}
              >
                เพิ่มรอบตรวจ
              </Button>
            </Paper>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid #E0E0E0",
                maxHeight: "calc(100vh - 420px)",
                overflow: "auto",
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#F8F9FA",
                        minWidth: { xs: 200, sm: 280 },
                        position: "sticky",
                        left: 0,
                        zIndex: 1000,
                        borderRight: "1px solid #E0E0E0",
                      }}
                    >
                      รายการประเมินคุณภาพ
                    </TableCell>
                    {rounds.map((r) => (
                      <TableCell
                        key={r.id}
                        align="center"
                        sx={{ bgcolor: "#F8F9FA", minWidth: 100 }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          spacing={0.5}
                        >
                          <Chip
                            label={r.name}
                            size="small"
                            sx={{
                              bgcolor: THEME_NAVY,
                              color: "white",
                              fontWeight: 800,
                              height: 20,
                            }}
                          />
                          {rounds.length > 1 && (
                            <IconButton
                              size="small"
                              onClick={() =>
                                setRounds(rounds.filter((rd) => rd.id !== r.id))
                              }
                              sx={{ p: 0 }}
                            >
                              <CloseIcon sx={{ fontSize: 14 }} color="error" />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    ))}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#E3F2FD",
                        color: THEME_NAVY,
                      }}
                    >
                      รวม
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#FFF8E1",
                        color: "#F57F17",
                      }}
                    >
                      %
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: "#F8F9FA" }}>
                      หมายเหตุ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {GROUPS.map((groupName) => (
                    <React.Fragment key={groupName}>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: groupName.includes("สรุป")
                              ? "#E8F5E9"
                              : "#F5F5F5",
                            py: 1,
                            position: "sticky",
                            left: 0,
                            zIndex: 800,
                            borderRight: "1px solid #E0E0E0",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 900,
                              color: groupName.includes("สรุป")
                                ? "#1B5E20"
                                : "#666",
                            }}
                          >
                            {groupName}
                          </Typography>
                        </TableCell>
                        <TableCell
                          colSpan={rounds.length + 3}
                          sx={{
                            bgcolor: groupName.includes("สรุป")
                              ? "#E8F5E9"
                              : "#F5F5F5",
                            py: 1,
                          }}
                        />
                      </TableRow>

                      {ASSESSMENT_CRITERIA.filter(
                        (c) => c.group === groupName,
                      ).map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell
                            sx={{
                              py: 1.5,
                              pl: 3,
                              position: "sticky",
                              left: 0,
                              bgcolor: "white",
                              zIndex: 700,
                              borderRight: "1px solid #EEE",
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {item.icon}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: groupName.includes("สรุป")
                                    ? 800
                                    : 500,
                                }}
                              >
                                {item.label}
                              </Typography>
                            </Stack>
                          </TableCell>

                          {rounds.map((r) => {
                            const groupSum = getRoundTotalForGroup(
                              r.id,
                              groupName,
                            );
                            const isOver = groupSum > targetLimit + 0.001;
                            const currentVal =
                              values[`${r.id}_${item.id}`] || "";

                            return (
                              <TableCell key={r.id} align="center">
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  autoComplete="off"
                                  type="number"
                                  value={currentVal}
                                  onChange={(e) =>
                                    handleValueChange(
                                      r.id,
                                      item.id,
                                      e.target.value,
                                    )
                                  }
                                  error={isOver}
                                  inputProps={{
                                    style: {
                                      textAlign: "center",
                                      fontWeight: 800,
                                    },
                                  }}
                                  sx={{
                                    width: 70,
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1.5,
                                      height: 36,
                                    },
                                  }}
                                />
                              </TableCell>
                            );
                          })}

                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 900,
                              bgcolor: "#F9FCFF",
                              color: THEME_NAVY,
                            }}
                          >
                            {getRowTotal(item.id)}
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{
                              fontWeight: 900,
                              color: "#F57F17",
                              bgcolor: "#FFFDF0",
                            }}
                          >
                            {totalSamplesOverall > 0
                              ? (
                                  (getRowTotal(item.id) / totalSamplesOverall) *
                                  100
                                ).toFixed(1)
                              : "0"}
                            %
                          </TableCell>

                          <TableCell>
                            <InputBase
                              placeholder="..."
                              value={rowRemarks[item.id] || ""}
                              onChange={(e) =>
                                setRowRemarks({
                                  ...rowRemarks,
                                  [item.id]: e.target.value,
                                })
                              }
                              sx={{ fontSize: "0.8rem", width: "100%" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>

      {/* Action Bar */}
      <BottomSummaryBar
        visible={!!selectedTruck}
        roundsCount={rounds.length}
        totalSamples={totalSamplesOverall}
        hasValidationError={hasValidationError}
        onSaveDraft={() => {
          // logic save draft
        }}
        onSubmit={() => setConfirmOpen(true)}
        accentColor={THEME_ACCENT}
        gradient={THEME_GRADIENT}
      />

      {/* Search Modal */}
      <DialogSearch
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={isSearching}
        trucks={filteredTrucks}
        onSelectTruck={(truck) => setSelectedTruck(truck as TruckQueue)}
      />

      {/* Confirm Modal */}
      <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการบันทึกข้อมูล"
        description="กรุณาตรวจสอบข้อมูลก่อนยืนยัน"
        confirmText="บันทึก"
        cancelText="ย้อนกลับ"
        accentColor={THEME_ACCENT}
        confirmColor={THEME_NAVY}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
      />
    </Box>
  );
};

export default App;
