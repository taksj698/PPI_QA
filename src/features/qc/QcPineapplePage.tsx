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
  TextField
} from "@mui/material";
import {
  Add as AddIcon,
  LocalShipping as TruckIcon,

  Close as CloseIcon,
  Search as SearchIcon,

  Layers as LayersIcon,

} from "@mui/icons-material";
import LoadingBackdrop from "@/components/LoadingBackdrop";
import DialogSearch from "@/components/DialogSearch";
import ConfirmDialog from "@/components/ConfirmModal";
import AppHeader from "@/components/AppHeader";
import BottomSummaryBar from "@/components/BottomSummaryBar";
import { ASSESSMENT_CRITERIA, GROUPS, THEME_ACCENT, THEME_BLUE_LIGHT, THEME_GRADIENT, THEME_NAVY } from "./constants";
import { useQcPineapple } from "./useQcPineapple";



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
    setRowRemarks,
    hasValidationError,
    setConfirmOpen,
    openSearch,
    searchQuery,
    setSearchQuery,
    isSearching,
    filteredTrucks,
    setSelectedTruck, confirmOpen,
    handleSubmit
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

export default QcPineapplePage;
