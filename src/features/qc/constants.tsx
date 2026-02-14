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

export const THEME_NAVY = "#1A237E";
export const THEME_BLUE_LIGHT = "#E3F2FD";
export const THEME_ACCENT = "#2962FF";
export const  THEME_GRADIENT = "linear-gradient(135deg, #1A237E 0%, #2962FF 100%)";

export const  ASSESSMENT_CRITERIA: AssessmentCriteria[] = [
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

export const  GROUPS: string[] = ["ขนาด", "ความสุก", "ตำหนิ", "สรุปจำนวนลูก (รวม)"];

export const  MOCK_TRUCKS: TruckQueue[] = [
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
