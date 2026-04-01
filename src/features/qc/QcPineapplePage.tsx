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
  Fade,
  TextField,
  Divider
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
import { ASSESSMENT_CRITERIA, GROUP_QA, THEME_ACCENT, THEME_BLUE_LIGHT, THEME_GRADIENT, THEME_NAVY } from "./constants";
import { useQcPineapple } from "./useQcPineapple";
import { authService } from "../login/auth.service";
import { QcCheck } from "@/types/qcCheck.type";
import { group } from "console";
import { formatDateTime } from "@/utils/date";
import theme from "@/theme/theme";


const QcPineapplePage = () => {
  const {
    isLoading,
    setOpenSearch,
    selectedTruck,
    globalSampleCount,
    handleSampleCountChange,
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
    hasValidationError,
    setConfirmOpen,
    openSearch,
    searchQuery,
    setSearchQuery,
    isSearching,
    setSelectedTruck, confirmOpen,
    handleSubmit,
    saveDraft,
    confirmAction,
    confirmConfig,
    setConfirmAction,
    setConfirmConfig
  } = useQcPineapple();






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
                sx={(theme) => ({
                  borderRadius: 10,
                  px: 6,
                  py: 1.5,
                  bgcolor: THEME_ACCENT,
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 20px rgba(16, 20, 29, 0.3)",
                  background: theme.custom.gradientHeader
                })}
              >
                ค้นหาคิวรถ
              </Button>
            </Box>
          </Fade>
        ) : (
          <>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, border: '1px solid #E0E0E0', mb: 2, bgcolor: 'white' }}>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', lg: 'block' } }} />}>

                {/* Truck & Ticket Info */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: THEME_BLUE_LIGHT, color: THEME_ACCENT }}>
                    <TruckIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                      <Typography variant="h6" fontWeight={900} color={THEME_NAVY}>{selectedTruck.plate}</Typography>
                      <Chip label={selectedTruck.truckTypeName} size="small" sx={{ fontWeight: 700, bgcolor: '#E8EAF6' }} />
                      <Chip
                        size="small"
                        sx={{ height: 20, fontSize: '0.65rem' }}
                        {...({
                          0: { label: "NEW", color: "info" },
                          1: { label: "DRAFT", color: "warning" },
                        } as const)[selectedTruck.qcState ?? 0]}
                      />
                    </Stack>






                    <Stack direction="row" spacing={1} alignItems="center">
                      <TicketIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary" fontWeight={700}>{selectedTruck.ticketOutCode}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="textSecondary" noWrap>{selectedTruck.companyName}</Typography>
                    </Stack>
                  </Box>
                </Stack>

                {/* Weight Info */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary" fontWeight={800} display="block">น้ำหนักสุทธิ</Typography>
                    <Typography variant="h5" fontWeight={900} color="#2E7D32">{selectedTruck.grossWeight} <Typography component="span" variant="body2">กิโลกรัม</Typography></Typography>
                  </Box>
                  <Box sx={{ bgcolor: '#F5F5F5', p: 1, borderRadius: 2 }}>
                    <Stack direction="row" spacing={2}>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">เข้า</Typography>
                        <Typography variant="body2" fontWeight={800}>{selectedTruck.inboundWeight} kg</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">ออก</Typography>
                        <Typography variant="body2" fontWeight={800}>{selectedTruck.outboundWeight} kg</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>

                {/* Time & QC Setup */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimeIcon sx={{ fontSize: 16, color: '#FF9800' }} />
                      <Typography variant="caption" fontWeight={800}>
                        เวลาเข้า: {selectedTruck.inboundDate
                          ? formatDateTime(selectedTruck.inboundDate)
                          : "-"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LayersIcon sx={{ fontSize: 16, color: '#EF6C00' }} />
                      <Typography variant="caption" fontWeight={800} color="#EF6C00">สุ่มรอบละ :</Typography>
                      <Select
                        size="small"
                        value={globalSampleCount}
                        onChange={handleSampleCountChange}
                        variant="standard"
                        disableUnderline
                        sx={{ fontWeight: 900, color: '#EF6C00', fontSize: '0.875rem' }}
                      >
                        {[5, 10, 15, 20].map(val => (
                          <MenuItem key={val} value={val}>{val} ลูก</MenuItem>
                        ))}
                      </Select>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
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
                    <TableCell sx={{ fontWeight: 800, bgcolor: "#F8F9FA" }}>
                      น้ำหนักประมาณการต่อคัน
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: "#F8F9FA" }}>
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

                      {ASSESSMENT_CRITERIA.filter(
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
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {item.icon}
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: groupName.name.includes("สรุป")
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
                              value={estimatedWeights[item.id] || ""}
                              onChange={(e) =>
                                setEstimatedWeights({
                                  ...estimatedWeights,
                                  [item.id]: e.target.value,
                                })
                              }
                              sx={{ fontSize: "0.8rem", width: "100%" }}
                            />
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
          setConfirmConfig({
            title: "ยืนยันบันทึกร่าง",
            description: "",
            confirmText: "บันทึก",
          });
          setConfirmAction(() => saveDraft); 
          setConfirmOpen(true);
        }}
        onSubmit={() => {
          setConfirmConfig({
            title: "ยืนยันส่งผลตรวจ",
            description: "",
            confirmText: "ส่งผลตรวจ",
          });
          setConfirmAction(() => handleSubmit); 
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
        onSelectTruck={chooseTruck}
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
        onConfirm={() => {
          confirmAction?.(); // 🔥 เรียก function ที่ set มา
          setConfirmOpen(false);
        }}
      />
    </Box>
  );
};

export default QcPineapplePage;
