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
export const THEME_GRADIENT = "linear-gradient(135deg, #1A237E 0%, #2962FF 100%)";

export const ASSESSMENT_CRITERIA: AssessmentCriteria[] = [
  {
    id: "1", //size_large
    label: "ลูกใหญ่ (≥ 95 mm)",
    group: "SIZE",
    icon: <StraightenIcon fontSize="small" color="primary" />,
  },
  {
    id: "2", //size_medium
    label: "ลูกเล็ก (85 - 94 mm)",
    group: "SIZE",
    icon: <StraightenIcon fontSize="small" color="primary" />,
  },
  {
    id: "3", //size_small
    label: "ลูกจิ๋ว (< 75-84 mm)",
    group: "SIZE",
    icon: <StraightenIcon fontSize="small" color="primary" />,
  },
  {
    id: "4", //ripe_raw
    label: "ดิบ",
    group: "RIPEN",
    icon: <GrassIcon fontSize="small" sx={{ color: "#4CAF50" }} />,
  },
  {
    id: "5", //ripe_yellow1
    label: "ปรากฎเหลือง (1-3 ตา)",
    group: "RIPEN",
    icon: <GrassIcon fontSize="small" sx={{ color: "#FFEB3B" }} />,
  },
  {
    id: "6", //ripe_half
    label: "ครึ่งลูกขึ้นไป",
    group: "RIPEN",
    icon: <GrassIcon fontSize="small" sx={{ color: "#FFC107" }} />,
  },
  {
    id: "7",//def_stunted_less
    label: "แกร็น < 30%",
    group: "FLAW",
    icon: <WarningIcon fontSize="small" sx={{ color: "#FF9800" }} />,
  },
  {
    id: "8",//def_stunted_more
    label: "แกร็น > 30%",
    group: "FLAW",
    icon: <WarningIcon fontSize="small" sx={{ color: "#F44336" }} />,
  },
  {
    id: "9",//def_bruised_less
    label: "ช้ำ < 30%",
    group: "FLAW",
    icon: <WaterDropIcon fontSize="small" sx={{ color: "#9C27B0" }} />,
  },
  {
    id: "10",//def_bruised_mid
    label: "ช้ำ > 30-50%",
    group: "FLAW",
    icon: <WaterDropIcon fontSize="small" sx={{ color: "#7B1FA2" }} />,
  },
  {
    id: "11",//def_bruised_more
    label: "ช้ำ > 50%",
    group: "FLAW",
    icon: <WaterDropIcon fontSize="small" sx={{ color: "#4A148C" }} />,
  },
  {
    id: "12",//def_sunburn
    label: "แดดเผา",
    group: "FLAW",
    icon: <SunIcon fontSize="small" sx={{ color: "#FF5722" }} />,
  },
  {
    id: "13",//def_hollow
    label: "เนื้อโพรง",
    group: "FLAW",
    icon: <HollowIcon fontSize="small" sx={{ color: "#795548" }} />,
  },
  {
    id: "14",//def_rotten
    label: "เน่า",
    group: "FLAW",
    icon: <BlockIcon fontSize="small" color="error" />,
  },
  {
    id: "15",//def_fungus
    label: "เชื้อรา",
    group: "FLAW",
    icon: <FungusIcon fontSize="small" sx={{ color: "#607D8B" }} />,
  },
  {
    id: "16",//def_seed
    label: "เมล็ด",
    group: "FLAW",
    icon: <SeedIcon fontSize="small" sx={{ color: "#212121" }} />,
  },
  {
    id: "17",//def_deformed
    label: "รูปร่างผิดปกติ",
    group: "FLAW",
    icon: <DeformedIcon fontSize="small" sx={{ color: "#9E9E9E" }} />,
  },
  {
    id: "18",//def_pest
    label: "สิ่งปนเปื้อน/สัตว์กัดแทะ",
    group: "FLAW",
    icon: <BugIcon fontSize="small" sx={{ color: "#3E2723" }} />,
  },
  {
    id: "19",//def_fraud
    label: "พันธุ์อื่น (Food Fraud)",
    group: "FLAW",
    icon: <BlockIcon fontSize="small" color="error" />,
  },
  {
    id: "20",//summary_good
    label: "จำนวนลูกที่เป็นของดี",
    group: "SUMMARY",
    icon: <SuccessIcon fontSize="small" color="success" />,
  },
  {
    id: "21",//summary_minor
    label: "จำนวนลูกที่มีแกร็น <30% ช้ำ <30%",
    group: "SUMMARY",
    icon: <WarningIcon fontSize="small" sx={{ color: "#FFC107" }} />,
  },
  {
    id: "22",//summary_waste
    label: "จำนวนลูกที่เป็นของเสีย (*)",
    group: "SUMMARY",
    icon: <WasteIcon fontSize="small" color="error" />,
  },
];

export const GROUP_QA: GroupQA[] = [
  { group: "SIZE", name: "ขนาด" },
  { group: "RIPEN", name: "ความสุก" },
  { group: "FLAW", name: "ตำหนิ" },
  { group: "SUMMARY", name: "สรุปจำนวนลูก (รวม)" },
];


export const QUALITY_STATUS = {
  PENDING: "PENDING"
};

export const DOC_TYPE = {
  WEIGHTDATA: "WEIGHTDATA"
};

export const DIMENSION_TYPE = {
  DETAIL: "DETAIL",
  RANDOM: "RANDOM",
  REMARK: "REMARK",
  AVG: "AVG",
  TOTAL: "TOTAL",
  PERCENT: "PERCENT",
  ESTIMATE: "ESTIMATE",
};

export const DIMENSION_UNIT = {
  PPM: "PPM",
  PERCENT: "PERCENT",
  KG: "KG",
  EACH: "EACH",
};

// export const  GROUPS: string[] = ["ขนาด", "ความสุก", "ตำหนิ", "สรุปจำนวนลูก (รวม)"];

// export const  MOCK_TRUCKS: TruckQueue[] = [
//   {
//     id: "T001",
//     plate: "82-6989",
//     supplier: "สวนกำนันเปี๊ยก",
//     time: "08:30",
//     weight: "9.5 ตัน",
//     type: "6 ล้อ",
//   },
//   {
//     id: "T002",
//     plate: "70-1234",
//     supplier: "ไร่รวมทรัพย์",
//     time: "09:15",
//     weight: "12.0 ตัน",
//     type: "10 ล้อ",
//   },
//   {
//     id: "T003",
//     plate: "ผก-555",
//     supplier: "เกษตรเจริญผล",
//     time: "10:00",
//     weight: "4.2 ตัน",
//     type: "กระบะ",
//   },
//   {
//     id: "T004",
//     plate: "บพ-888",
//     supplier: "สวนนายเก่ง",
//     time: "10:30",
//     weight: "8.8 ตัน",
//     type: "6 ล้อ",
//   },
//   {
//     id: "T005",
//     plate: "กข-111",
//     supplier: "ไร่แสงจันทร์",
//     time: "11:00",
//     weight: "10.2 ตัน",
//     type: "10 ล้อ",
//   },
// ];
