import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Fade,
  TextField,
  Divider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  LocalShipping as TruckIcon,
  Business as BusinessIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ConfirmationNumber as TicketIcon,
  Layers as LayersIcon,
} from "@mui/icons-material";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import DialogSearch from "@/components/DialogSearch";
import ConfirmDialog from "@/components/ConfirmModal";
import AppHeader from "@/components/AppHeader";
import BottomSummaryBar from "@/components/BottomSummaryBar";
import {
  ASSESSMENT_CRITERIA,
  GROUP_QA,
  THEME_ACCENT,
  THEME_BLUE_LIGHT,
  THEME_GRADIENT,
  THEME_NAVY,
} from "./constants";
import { useQcPineapple } from "./useQcPineapple";
import { authService } from "../login/auth.service";
import { QcCheck } from "@/types/qcCheck.type";
import { group } from "console";
import { formatDateTime } from "@/utils/date";
import theme from "@/theme/theme";
import { qcService, EpicorPoItem } from "@/services/qc.service";
import { QcMasterItem } from "@/types/qcMaster.type";

const QcPineapplePage = () => {
  const {
    isLoading,
    setOpenSearch,
    selectedTruck,
    globalSampleCount,
    handleSampleCountChange,
    nitrateSampleCounts,
    nitrateOptions,
    handleNitrateSampleCountChange,
    setRounds,
    rounds,
    getRoundTotalForGroup,
    targetLimit,
    values,
    handleValueChange,
    getRowTotal,
    totalSamplesOverall,
    rowRemarks,
    estimatedWeights,
    setEstimatedWeights,
    setRowRemarks,
    chooseTruck,
    inspectorBy,
    hasValidationError,
    setConfirmOpen,
    openSearch,
    searchQuery,
    setSearchQuery,
    isSearching,
    setSelectedTruck,
    confirmOpen,
    handleSubmit,
    saveDraft,
    confirmAction,
    confirmConfig,
    setConfirmAction,
    setConfirmConfig,
    handleRemarkChange,
    handleEstimatedWeightsChange,
    getSectionAverage,
    getSectionRounds,
    getSectionCriteria,
  } = useQcPineapple();

  const [detail, setDetail] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return {
      docNo: "",
      poNo: "",
      lineNo: 0,
      selectedRowIdent: "",
      supplierId: "",
      nameAddress: "",
      isStation: false,
      receiveDate: todayDate,
      receiveTime: nowTime,
      exitTime: "",
      receiver: "",
      productType: "",
      sourceArea: "",
      region: "",
      reject: false,
      remark: "",
      truckType: "",
      dumperNo: "",
      no3Tag: "",
    };
  });

  const [sourceTypes, setSourceTypes] = useState<QcMasterItem[]>([]);
  const [sourceZones, setSourceZones] = useState<QcMasterItem[]>([]);
  const [sourceRegions, setSourceRegions] = useState<QcMasterItem[]>([]);
  const [sourceDumpers, setSourceDumpers] = useState<QcMasterItem[]>([]);
  const [products, setProducts] = useState<{ id: number; productId: string; productName: string }[]>([]);
  const [productWeights, setProductWeights] = useState<Record<string, string>>({});
  const [epicorPoList, setEpicorPoList] = useState<EpicorPoItem[]>([]);

  useEffect(() => {
    qcService
      .getQcMaster()
      .then((res) => {
        if (res.isSuccess && res.data) {
          setSourceTypes(res.data.sourceTypes);
          setSourceZones(res.data.sourceZones);
          setSourceRegions(res.data.sourceRegions);
          setSourceDumpers(res.data.sourceDumpers ?? []);
        }
      })
      .catch(console.error);

    qcService
      .getProducts()
      .then((res) => {
        console.log("[getProducts] response:", res);
        if (res.isSuccess && res.data) {
          const filtered = res.data
            .filter((p) => p.productId !== "BIG")
            .map((p) => ({ id: p.id, productId: p.productId, productName: p.productName }));
          console.log("[getProducts] filtered products:", filtered);
          setProducts(filtered);
        }
      })
      .catch((e) => console.error("[getProducts] error:", e));
  }, []);

  const handleDetailChange = (field: string, value: string | boolean) => {
    setDetail((prev) => ({ ...prev, [field]: value }));
  };

  const applyPoToDetail = (po: EpicorPoItem) => {
    const addressParts = [
      po.vendor_Address1,
      po.vendor_Address3,
      po.vendor_City,
      po.vendor_State,
      po.vendor_ZIP,
    ].filter(Boolean);
    const isStation = po.poHeader_PPI_IsPurchaseStation_c ?? false;
    setDetail((prev) => ({
      ...prev,
      poNo: String(po.poHeader_PONum),
      lineNo: po.poDetail_POLine ?? 0,
      selectedRowIdent: po.rowIdent,
      supplierId: po.vendor_VendorID ?? "",
      nameAddress: [po.vendor_Name, ...addressParts].filter(Boolean).join(" "),
      isStation,
    }));
  };

  const getDetailDefaults = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const todayDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return {
      docNo: "",
      poNo: "",
      lineNo: 0,
      selectedRowIdent: "",
      supplierId: "",
      nameAddress: "",
      isStation: false,
      receiveDate: todayDate,
      receiveTime: nowTime,
      exitTime: "",
      receiver: "",
      productType: "",
      sourceArea: "",
      region: "",
      reject: false,
      remark: "",
      truckType: "",
      dumperNo: "",
      no3Tag: "",
    };
  };

  const handleChooseTruck = async (
    truck: Parameters<typeof chooseTruck>[0],
  ) => {
    await chooseTruck(truck);
    setDetail({ ...getDetailDefaults(), docNo: truck.sequenceId ?? "", supplierId: truck.supplierId ?? "" });

    let filtered: EpicorPoItem[] = [];
    setEpicorPoList([]);

    if (truck.supplierId) {
      try {
        const res = await qcService.getEpicorPo();
        if (res.isSuccess && res.data?.value?.length) {
          filtered = res.data.value.filter(
            (p) => p.vendor_VendorID?.trim() === truck.supplierId?.trim(),
          );
          setEpicorPoList(filtered);
          if (filtered.length > 0) applyPoToDetail(filtered[0]);
        }
      } catch (e) {
        console.error("Failed to fetch Epicor PO:", e);
      }
    }

    // fetch saved QC detail และ prefill ถ้ามีข้อมูล
    try {
      const detailRes = await qcService.getQcDetail(truck.sequenceId);
      if (detailRes.isSuccess && detailRes.data) {
        const d = detailRes.data;
        const toDateStr = (iso: string | null) => (iso ? iso.slice(0, 10) : "");
        const toTimeStr = (iso: string | null) =>
          iso ? iso.slice(11, 16) : "";

        // ตรวจว่า poNo ที่บันทึกไว้มีอยู่ใน Epicor list ปัจจุบันไหม
        // ถ้าไม่มี ให้ใช้ค่าจาก Epicor (prev.poNo) แทน เพื่อให้ dropdown แสดงได้
        const matchingPo = d.poNo
          ? filtered.find(
              (p) =>
                String(p.poHeader_PONum) === d.poNo &&
                (d.lineNo ? p.poDetail_POLine === d.lineNo : true),
            )
          : null;
        if (matchingPo) applyPoToDetail(matchingPo);

        setDetail((prev) => ({
          ...prev,
          poNo: matchingPo ? d.poNo! : prev.poNo,
          lineNo: matchingPo ? (matchingPo.poDetail_POLine ?? 0) : (d.lineNo || prev.lineNo),
          selectedRowIdent: matchingPo ? matchingPo.rowIdent : prev.selectedRowIdent,
          isStation: d.isStation,
          region: d.regionCode ?? prev.region,
          sourceArea: d.zoneCode ?? prev.sourceArea,
          reject: d.isReject ?? prev.reject,
          remark: d.remark ?? prev.remark,
          dumperNo: d.dumperNo ?? prev.dumperNo,
          no3Tag: d.no3TagColor ?? prev.no3Tag,
          productType: d.sourceTypeCode ?? prev.productType,
          receiveDate: toDateStr(d.qaReceiveDate) || prev.receiveDate,
          receiveTime: toTimeStr(d.qaReceiveDateTime) || prev.receiveTime,
          exitTime: toTimeStr(d.qaDepartDateTime) || prev.exitTime,
        }));
      }
    } catch (e) {
      // 404 = ยังไม่เคยบันทึก ไม่ต้อง error
      console.warn("No saved QC detail:", e);
    }

    // prefill product weights
    try {
      const pwRes = await qcService.getProductWeights(truck.sequenceId);
      if (pwRes.isSuccess && pwRes.data?.tbWeightSummaryDetails?.length) {
        const mapped: Record<string, string> = {};
        pwRes.data.tbWeightSummaryDetails.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product) {
            mapped[product.productId] = String(item.grossWeight);
          }
        });
        setProductWeights(mapped);
      }
    } catch (e) {
      console.warn("No saved product weights:", e);
    }
  };

  const handlePoSelect = (rowIdent: string) => {
    const po = epicorPoList.find((p) => p.rowIdent === rowIdent);
    if (po) applyPoToDetail(po);
  };

  const buildDateTimeISO = (date: string, time: string): string => {
    const d = date || new Date().toISOString().slice(0, 10);
    const t = time || "00:00";
    return `${d}T${t}:00`;
  };

  const buildQcDetailPayload = () => {
    const today = new Date().toISOString().slice(0, 10);
    const baseDate = detail.receiveDate || today;
    return {
      docId: selectedTruck?.sequenceId ?? "",
      poNo: detail.poNo,
      lineNo: detail.lineNo,
      regionCode: detail.region,
      zoneCode: detail.sourceArea,
      isReject: detail.reject,
      remark: detail.remark,
      dumperNo: detail.dumperNo,
      no3Tag: !!detail.no3Tag,
      userName: inspectorBy,
      no3TagColor: detail.no3Tag,
      sourceTypeCode: detail.productType,
      qaReceiveDate: buildDateTimeISO(baseDate, "00:00"),
      qaReceiveDateTime: buildDateTimeISO(baseDate, detail.receiveTime),
      qaDepartDateTime: buildDateTimeISO(baseDate, detail.exitTime),
    };
  };

  const buildProductWeightPayload = () => ({
    docId: selectedTruck?.sequenceId ?? "",
    data: products.map((p) => ({
      productId: p.id,
      grossWeight: Math.round(parseFloat(productWeights[p.productId] || "0")),
    })),
  });

  const saveWithDetail = async (mainAction: () => Promise<void>) => {
    console.log("[saveWithDetail] called, products:", products.length, "docId:", selectedTruck?.sequenceId);
    try {
      await qcService.saveQcDetail(buildQcDetailPayload());
    } catch (e) {
      console.error("Failed to save qc-detail:", e);
    }
    try {
      console.log("[saveWithDetail] about to save product weights, payload:", buildProductWeightPayload());
      await qcService.saveProductWeights(buildProductWeightPayload());
    } catch (e) {
      console.error("Failed to save product weights:", e);
    }
    await mainAction();
  };

  const getGroupTotal = (group: string): number => {
    return ASSESSMENT_CRITERIA.filter((c) => c.group === group).reduce(
      (sum, item) => sum + getRowTotal(item.id),
      0,
    );
  };

  const NITRATE_PAIRS = [
    { key: "21-22", label: "เฉลี่ย 1-2", itemIds: ["21", "22"] },
    { key: "23-24", label: "เฉลี่ย 3-4", itemIds: ["23", "24"] },
    { key: "25-26", label: "เฉลี่ย 5-6", itemIds: ["25", "26"] },
  ];

  const getNitratePairAverage = (itemIds: string[], sampleCount: number) => {
    const valuesList = rounds
      .flatMap((r) =>
        itemIds
          .map((id) => values[`${r.id}_${id}`])
          .filter((v) => v !== undefined && v !== "")
          .map((v) => parseFloat(v as string)),
      )
      .filter((num) => !Number.isNaN(num));

    if (!valuesList.length || sampleCount <= 0) return "";
    return (
      valuesList.reduce((sum, num) => sum + num, 0) / sampleCount
    ).toFixed(2);
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
        title="QA PINEAPPLE"
        logoText="Q"
        onSearchClick={() => setOpenSearch(true)}
        onLogout={() => authService.logout()}
      />

      {/* Main Content */}
      <Container maxWidth={false} sx={{ mt: 2 }}>
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
                sx={(theme) => ({
                  borderRadius: 10,
                  px: 6,
                  py: 1.5,
                  bgcolor: THEME_ACCENT,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 20px rgba(16, 20, 29, 0.3)",
                  background: theme.custom.gradientHeader,
                })}
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
                mb: 2,
                bgcolor: "white",
              }}
            >
              <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={3}
                divider={
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", lg: "block" } }}
                  />
                }
              >
                {/* Truck & Ticket Info */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ flexGrow: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: THEME_BLUE_LIGHT,
                      color: THEME_ACCENT,
                    }}
                  >
                    <TruckIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={900}
                        color={THEME_NAVY}
                      >
                        {selectedTruck.plate}
                      </Typography>
                      <Chip
                        label={selectedTruck.truckTypeName}
                        size="small"
                        sx={{ fontWeight: 700, bgcolor: "#E8EAF6" }}
                      />
                      <Chip
                        size="small"
                        sx={{ height: 20, fontSize: "0.65rem" }}
                        {...(
                          {
                            0: { label: "NEW", color: "info" },
                            1: { label: "DRAFT", color: "warning" },
                            2: { label: "SAVE", color: "success" },
                          } as const
                        )[selectedTruck.qcState ?? 0]}
                      />
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TicketIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={700}
                      >
                        {selectedTruck.sequenceId}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {selectedTruck.companyName}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Weight Info */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      fontWeight={800}
                      display="block"
                    >
                      น้ำหนักสุทธิ
                    </Typography>
                    <Typography variant="h5" fontWeight={900} color="#2E7D32">
                      {selectedTruck.grossWeight}{" "}
                      <Typography component="span" variant="body2">
                        กิโลกรัม
                      </Typography>
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#F5F5F5", p: 1, borderRadius: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          display="block"
                        >
                          เข้า
                        </Typography>
                        <Typography variant="body2" fontWeight={800}>
                          {selectedTruck.inboundWeight} kg
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          display="block"
                        >
                          ออก
                        </Typography>
                        <Typography variant="body2" fontWeight={800}>
                          {selectedTruck.outboundWeight} kg
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>

                {/* Time & QC Setup */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimeIcon sx={{ fontSize: 16, color: "#FF9800" }} />
                      <Typography variant="caption" fontWeight={800}>
                        เวลาเข้า:{" "}
                        {selectedTruck.inboundDate
                          ? formatDateTime(selectedTruck.inboundDate)
                          : "-"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LayersIcon sx={{ fontSize: 16, color: "#EF6C00" }} />
                      <Typography
                        variant="caption"
                        fontWeight={800}
                        color="#EF6C00"
                      >
                        สุ่มรอบละ :
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
                          fontSize: "0.875rem",
                        }}
                      >
                        {[5, 10, 15, 20].map((val) => (
                          <MenuItem key={val} value={val}>
                            {val} ลูก
                          </MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </Paper>

            {/* Detail Card */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 4,
                border: "1px solid #E0E0E0",
                mb: 2,
                bgcolor: "white",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={800}
                color="text.secondary"
                sx={{
                  display: "block",
                  mb: 1.5,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Detail
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
                  gap: 2,
                }}
              >
                {/* Left Column */}
                <Stack spacing={1.5}>
                  <TextField
                    label="เลขที่เอกสาร"
                    size="small"
                    fullWidth
                    value={detail.docNo}
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <TextField
                    select
                    label="เลขที่ PO"
                    size="small"
                    fullWidth
                    value={detail.selectedRowIdent}
                    onChange={(e) => handlePoSelect(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>-- เลือกเลขที่ PO --</em>
                    </MenuItem>
                    {epicorPoList.map((po) => (
                      <MenuItem
                        key={po.rowIdent}
                        value={po.rowIdent}
                      >
                        {po.poHeader_OrderDate?.slice(0, 10)} | {po.poHeader_PONum} | Line {po.poDetail_POLine ?? "-"} | {po.poHeader_PPI_CarID_c ?? "-"} | {po.poHeader_PPI_CarIDStation_c ?? "-"} | {po.poDetail_OrderQty ?? "-"}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Supplier ID"
                    size="small"
                    fullWidth
                    value={detail.supplierId}
                    onChange={(e) =>
                      handleDetailChange("supplierId", e.target.value)
                    }
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <SearchIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    label="Name / Address"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={detail.nameAddress}
                    onChange={(e) =>
                      handleDetailChange("nameAddress", e.target.value)
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={detail.isStation}
                        onChange={(e) =>
                          handleDetailChange("isStation", e.target.checked)
                        }
                      />
                    }
                    label={
                      <Typography variant="body2">
                        กรณีสถานีรับซื้อ (Station)
                      </Typography>
                    }
                  />
                </Stack>

                {/* Middle Column */}
                <Stack spacing={1.5}>
                  <TextField
                    label="วันที่รับสินค้า"
                    size="small"
                    fullWidth
                    type="date"
                    value={detail.receiveDate}
                    onChange={(e) =>
                      handleDetailChange("receiveDate", e.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="เวลารับ"
                    size="small"
                    fullWidth
                    type="time"
                    value={detail.receiveTime}
                    onChange={(e) =>
                      handleDetailChange("receiveTime", e.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="เวลาออก"
                    size="small"
                    fullWidth
                    type="time"
                    value={detail.exitTime}
                    onChange={(e) =>
                      handleDetailChange("exitTime", e.target.value)
                    }
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <TextField
                    label="ทะเบียนรถ"
                    size="small"
                    fullWidth
                    value={selectedTruck.plate}
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <TextField
                    label="ผู้บันทึก"
                    size="small"
                    fullWidth
                    value={inspectorBy}
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <TextField
                    select
                    label="ประเภท"
                    size="small"
                    fullWidth
                    value={detail.productType}
                    onChange={(e) =>
                      handleDetailChange("productType", e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>-- เลือกประเภท --</em>
                    </MenuItem>
                    {sourceTypes.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="แหล่งวัตถุดิบ"
                    size="small"
                    fullWidth
                    value={detail.sourceArea}
                    onChange={(e) =>
                      handleDetailChange("sourceArea", e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>-- เลือกแหล่งวัตถุดิบ --</em>
                    </MenuItem>
                    {sourceZones.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Region"
                    size="small"
                    fullWidth
                    value={detail.region}
                    onChange={(e) =>
                      handleDetailChange("region", e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>-- เลือก Region --</em>
                    </MenuItem>
                    {sourceRegions.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                {/* Right Column */}
                <Stack spacing={1.5}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={detail.reject}
                        onChange={(e) =>
                          handleDetailChange("reject", e.target.checked)
                        }
                      />
                    }
                    label={<Typography variant="body2">Reject</Typography>}
                  />
                  <TextField
                    label="หมายเหตุ"
                    size="small"
                    fullWidth
                    multiline
                    rows={2}
                    value={detail.remark}
                    onChange={(e) =>
                      handleDetailChange("remark", e.target.value)
                    }
                  />
                  <TextField
                    label="ประเภทรถ"
                    size="small"
                    fullWidth
                    value={selectedTruck.truckTypeName ?? ""}
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <TextField
                    select
                    label="Dumper No."
                    size="small"
                    fullWidth
                    value={detail.dumperNo}
                    onChange={(e) =>
                      handleDetailChange("dumperNo", e.target.value)
                    }
                  >
                    <MenuItem value="">
                      <em>-- เลือก Dumper No. --</em>
                    </MenuItem>
                    {sourceDumpers.map((item) => (
                      <MenuItem key={item.code} value={item.code}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Box>
                    <FormLabel sx={{ fontSize: "0.75rem" }}>No3 Tag</FormLabel>
                    <RadioGroup
                      value={detail.no3Tag}
                      onChange={(e) =>
                        handleDetailChange("no3Tag", e.target.value)
                      }
                    >
                      {[
                        { value: "green", label: "เขียว" },
                        { value: "yellow", label: "เหลือง" },
                        { value: "red", label: "แดง" },
                        { value: "yellow_with_green", label: "เหลืองคาดเขียว" },
                        { value: "brown", label: "น้ำตาล" },
                      ].map((tag) => (
                        <FormControlLabel
                          key={tag.value}
                          value={tag.value}
                          control={<Radio size="small" />}
                          label={
                            <Typography variant="body2">{tag.label}</Typography>
                          }
                          sx={{ height: 28 }}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                </Stack>
              </Box>

              {/* Product Weight Section */}
              {products.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    color="text.secondary"
                    sx={{
                      display: "block",
                      mb: 1.5,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    น้ำหนักสินค้า (กก.)
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr 1fr",
                        sm: "repeat(4, 1fr)",
                        lg: "repeat(8, 1fr)",
                      },
                      gap: 1.5,
                    }}
                  >
                    {products.map((p) => (
                      <TextField
                        key={p.productId}
                        label={p.productName}
                        size="small"
                        type="number"
                        fullWidth
                        value={productWeights[p.productId] ?? ""}
                        onChange={(e) =>
                          setProductWeights((prev) => ({
                            ...prev,
                            [p.productId]: e.target.value,
                          }))
                        }
                        slotProps={{
                          inputLabel: { shrink: true },
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Typography variant="caption" color="text.secondary">
                                  กก.
                                </Typography>
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          "& input": { textAlign: "right", fontWeight: 700 },
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Paper>

            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid #E0E0E0",
                // maxHeight: "calc(100vh - 420px)",
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
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#F8F9FA",
                        minWidth: 220,
                      }}
                    >
                      น้ำหนักประมาณการต่อคัน
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 800,
                        bgcolor: "#F8F9FA",
                        minWidth: 220,
                      }}
                    >
                      หมายเหตุ
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {GROUP_QA.map((groupName) => (
                    <React.Fragment key={groupName.group}>
                      <TableRow>
                        <TableCell
                          sx={{
                            bgcolor: groupName.name.includes("สรุป")
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
                              color: groupName.name.includes("สรุป")
                                ? "#1B5E20"
                                : "#666",
                            }}
                          >
                            {groupName.name}
                          </Typography>
                        </TableCell>
                        <TableCell
                          colSpan={rounds.length + 4}
                          sx={{
                            bgcolor: groupName.name.includes("สรุป")
                              ? "#E8F5E9"
                              : "#F5F5F5",
                            py: 1,
                          }}
                        />
                      </TableRow>

                      {groupName.group === "NITRATE"
                        ? [
                            {
                              key: "21-22",
                              label: "เฉลี่ย 1-2",
                              itemIds: ["21", "22"],
                            },
                            {
                              key: "23-24",
                              label: "เฉลี่ย 3-4",
                              itemIds: ["23", "24"],
                            },
                            {
                              key: "25-26",
                              label: "เฉลี่ย 5-6",
                              itemIds: ["25", "26"],
                            },
                          ].flatMap((pair) => {
                            const pairItems = ASSESSMENT_CRITERIA.filter((c) =>
                              pair.itemIds.includes(c.id),
                            );

                            return [
                              ...pairItems.map((item) => (
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
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {item.icon}
                                      </Box>
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontWeight: groupName.name.includes(
                                            "สรุป",
                                          )
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
                                      groupName.group,
                                    );
                                    const isOver =
                                      groupSum > targetLimit + 0.001;
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
                                          onChange={(e) => {
                                            handleValueChange(
                                              groupName.group,
                                              r.id,
                                              item.id,
                                              e.target.value,
                                            );
                                          }}
                                          error={false}
                                          inputProps={{
                                            style: {
                                              textAlign: "center",
                                              fontWeight: 800,
                                            },
                                          }}
                                          sx={{
                                            width: 90,
                                            "& .MuiOutlinedInput-root": {
                                              borderRadius: 1.5,
                                              height: 40,
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
                                      bgcolor: "#a5abb1",
                                      color: THEME_NAVY,
                                    }}
                                  >
                                    {getRowTotal(item.id).toFixed(2)}
                                  </TableCell>

                                  <TableCell
                                    align="center"
                                    sx={{
                                      fontWeight: 900,
                                      color: "#F57F17",
                                      bgcolor: "#FFFDF0",
                                    }}
                                  >
                                    -
                                  </TableCell>

                                  <TableCell>
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      placeholder="..."
                                      fullWidth
                                      value={
                                        estimatedWeights[`9_${item.id}`] || ""
                                      }
                                      onChange={(e) =>
                                        handleEstimatedWeightsChange(
                                          groupName.group,
                                          9,
                                          item.id,
                                          e.target.value,
                                        )
                                      }
                                      inputProps={{
                                        style: { fontSize: "0.8rem" },
                                      }}
                                      sx={{ minWidth: 220 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      placeholder="..."
                                      fullWidth
                                      value={rowRemarks[`9_${item.id}`] || ""}
                                      onChange={(e) =>
                                        handleRemarkChange(
                                          groupName.group,
                                          9,
                                          item.id,
                                          e.target.value,
                                        )
                                      }
                                      inputProps={{
                                        style: { fontSize: "0.8rem" },
                                      }}
                                      sx={{ minWidth: 220 }}
                                    />
                                  </TableCell>
                                </TableRow>
                              )),
                              <TableRow key={`summary-${pair.key}`}>
                                <TableCell
                                  sx={{
                                    py: 1.5,
                                    pl: 3,
                                    bgcolor: "#F5F5F5",
                                    borderRight: "1px solid #EEE",
                                  }}
                                >
                                  <Typography variant="body2" fontWeight={700}>
                                    {pair.label}
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  colSpan={rounds.length + 4}
                                  sx={{ bgcolor: "#F5F5F5", py: 1 }}
                                >
                                  <Stack direction="row" spacing={2}>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Typography variant="caption">
                                        จำนวน สุ่ม:
                                      </Typography>
                                      <Select
                                        size="small"
                                        value={
                                          nitrateSampleCounts[pair.key] ||
                                          nitrateOptions[0]
                                        }
                                        onChange={(e) =>
                                          handleNitrateSampleCountChange(
                                            pair.key,
                                            Number(e.target.value),
                                          )
                                        }
                                        sx={{ minWidth: 100 }}
                                      >
                                        {nitrateOptions.map((val) => (
                                          <MenuItem key={val} value={val}>
                                            {val}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </Stack>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{ minWidth: 90 }}
                                      >
                                        ค่าเฉลี่ย:
                                      </Typography>
                                      <TextField
                                        size="small"
                                        type="number"
                                        value={getNitratePairAverage(
                                          pair.itemIds,
                                          nitrateSampleCounts[pair.key] ||
                                            nitrateOptions[0],
                                        )}
                                        InputProps={{ readOnly: true }}
                                        sx={{ minWidth: 100 }}
                                      />
                                    </Stack>
                                  </Stack>
                                </TableCell>
                              </TableRow>,
                            ];
                          })
                        : ASSESSMENT_CRITERIA.filter(
                            (c) => c.group === groupName.group,
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
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {item.icon}
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: groupName.name.includes(
                                        "สรุป",
                                      )
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
                                  groupName.group,
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
                                      onChange={(e) => {
                                        handleValueChange(
                                          groupName.group,
                                          r.id,
                                          item.id,
                                          e.target.value,
                                        );
                                      }}
                                      error={
                                        !!(groupName.group === "NITRATE"
                                          ? false
                                          : isOver)
                                      }
                                      inputProps={{
                                        style: {
                                          textAlign: "center",
                                          fontWeight: 800,
                                        },
                                      }}
                                      sx={{
                                        width: 90,
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 1.5,
                                          height: 40,
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
                                {getRowTotal(item.id).toFixed(2)}
                              </TableCell>

                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: 900,
                                  color: "#F57F17",
                                  bgcolor: "#FFFDF0",
                                }}
                              >
                                {groupName.group === "NITRATE"
                                  ? "-"
                                  : (() => {
                                      const rowTotal = getRowTotal(item.id);
                                      const groupTotal = getGroupTotal(
                                        groupName.group,
                                      );
                                      return groupTotal > 0
                                        ? (
                                            (rowTotal / groupTotal) *
                                            100
                                          ).toFixed(1)
                                        : "0";
                                    })()}
                                {groupName.group !== "NITRATE" && "%"}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  placeholder="..."
                                  fullWidth
                                  value={estimatedWeights[`9_${item.id}`] || ""}
                                  onChange={(e) =>
                                    handleEstimatedWeightsChange(
                                      groupName.group,
                                      9,
                                      item.id,
                                      e.target.value,
                                    )
                                  }
                                  inputProps={{ style: { fontSize: "0.8rem" } }}
                                  sx={{ minWidth: 220 }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  placeholder="..."
                                  fullWidth
                                  value={rowRemarks[`9_${item.id}`] || ""}
                                  onChange={(e) =>
                                    handleRemarkChange(
                                      groupName.group,
                                      9,
                                      item.id,
                                      e.target.value,
                                    )
                                  }
                                  inputProps={{ style: { fontSize: "0.8rem" } }}
                                  sx={{ minWidth: 220 }}
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
          setConfirmConfig({
            title: "ยืนยันบันทึกร่าง",
            description: "",
            confirmText: "บันทึก",
          });
          setConfirmAction(() => () => saveWithDetail(saveDraft));
          setConfirmOpen(true);
        }}
        onSubmit={() => {
          setConfirmConfig({
            title: "ยืนยันส่งผลตรวจ",
            description: "",
            confirmText: "ส่งผลตรวจ",
          });
          setConfirmAction(() => () => saveWithDetail(handleSubmit));
          setConfirmOpen(true);
        }}
        accentColor={THEME_ACCENT}
        gradient={THEME_GRADIENT}
      />

      {/* Search Modal */}
      <DialogSearch
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        // searchQuery={searchQuery}
        // onSearchChange={setSearchQuery}
        // isSearching={isSearching}
        // trucks={filteredTrucks}
        onSelectTruck={handleChooseTruck}
      />

      {/* Confirm Modal */}
      {/* <ConfirmDialog
        open={confirmOpen}
        title="ยืนยันการบันทึกข้อมูล"
        description="กรุณาตรวจสอบข้อมูลก่อนยืนยัน"
        confirmText="บันทึก"
        cancelText="ย้อนกลับ"
        accentColor={THEME_ACCENT}
        confirmColor={THEME_NAVY}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleSubmit}
      /> */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText={confirmConfig.confirmText}
        cancelText="ย้อนกลับ"
        accentColor={THEME_ACCENT}
        confirmColor={THEME_NAVY}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          console.log("[onConfirm] confirmAction:", confirmAction);
          await confirmAction?.();
          setConfirmOpen(false);
        }}
      />
    </Box>
  );
};

export default QcPineapplePage;
