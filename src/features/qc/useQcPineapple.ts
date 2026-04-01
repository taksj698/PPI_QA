import { SelectChangeEvent } from "@mui/material";
import { ASSESSMENT_CRITERIA, DIMENSION_TYPE, DIMENSION_UNIT, DOC_TYPE, GROUP_QA, QUALITY_STATUS } from "./constants"; //, MOCK_TRUCKS
import { useEffect, useMemo, useState } from "react";
import { QcCheck } from "@/types/qcCheck.type";
import { group } from "console";
import { QualityRequest, TbQualityDetail } from "@/types/qualityRequest.type";
import { stringify } from "querystring";
import { qcService } from "@/services/qc.service";
import { QcInsertResponse, Quality, QualityDetail } from "@/types/qcInsert.type";
import { QcTicketResponse } from "@/types/QcResponse.type";



export const useQcPineapple = () => {
    const [selectedTruck, setSelectedTruck] = useState<QcCheck | null>(null);
    const [globalSampleCount, setGlobalSampleCount] = useState<number>(10);
    const [rounds, setRounds] = useState<Round[]>(() => [
        { id: 1, name: "R1" },
        { id: 2, name: "R2" },
        { id: 3, name: "R3" },
        { id: 4, name: "R4" },
        { id: 5, name: "R5" },
    ]);
    const [values, setValues] = useState<ValuesState>({});
    const [rowRemarks, setRowRemarks] = useState<RemarksState>({});
    const [estimatedWeights, setEstimatedWeights] = useState<EstimatedWeightState>({});

    // UI States
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmConfig, setConfirmConfig] = useState({
        title: "",
        description: "",
        confirmText: "",
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // main obj
    const [qualityRequestList, setQualityRequestList] = useState<QualityRequest[]>([]);

    useEffect(() => {
        console.log("Updated qualityRequestList:", qualityRequestList);
    }, [qualityRequestList]);

    const handleValueChange = (
        groupName: string,
        roundId: number,
        criteriaId: string,
        val: string,
    ) => {
        setValues((prev) => ({ ...prev, [`${roundId}_${criteriaId}`]: val }));

        const dateformat = new Date().toISOString().slice(0, 10).replace(/-/g, "");

        setQualityRequestList(prev => {
            // 🔍 หา parent (QualityRequest)
            const index = prev.findIndex(
                item =>
                    item.qualityType === groupName
            );

            const qualityRuleCode = `${groupName}_${DIMENSION_TYPE.DETAIL}_R${criteriaId}_C${roundId}`//`${criteriaId}_R${roundId}`;

            // 🧱 function สร้าง detail ใหม่
            const createDetail = (): TbQualityDetail => ({
                id: 0,
                qualityId: 0,
                qualityRuleCode,
                dimensionType: DIMENSION_TYPE.DETAIL,
                dimensionCode: `${DIMENSION_TYPE.DETAIL}_R${criteriaId}_C${roundId}`,
                dimensionValue: Number(val),
                dimensionUnit: DIMENSION_UNIT.EACH,
                remark: null
            });

            // ✅ กรณีมี parent แล้ว → update detail
            if (index !== -1) {
                const updated = [...prev];
                const parent = { ...updated[index] };

                const detailIndex = parent.tbQualityDetails.findIndex(
                    d => d.qualityRuleCode === qualityRuleCode
                );

                let newDetails = [...parent.tbQualityDetails];

                if (detailIndex !== -1) {
                    // 👉 update detail
                    newDetails[detailIndex] = {
                        ...newDetails[detailIndex],
                        dimensionValue: Number(val)
                    };
                } else {
                    // 👉 add detail
                    newDetails.push(createDetail());
                }

                parent.tbQualityDetails = newDetails;

                updated[index] = parent;
                return updated;
            }

            // ❌ ยังไม่มี parent → สร้างใหม่ + ใส่ detail ตัวแรก
            const newItem: QualityRequest = {
                qualityId: 0,
                qualityCode: `QC_${groupName}_${dateformat}`,
                qualityType: groupName,
                planCode: `${groupName}_${dateformat}`,
                docRefType: DOC_TYPE.WEIGHTDATA,
                docId: selectedTruck?.sequenceId || "",
                inspectorDateTime: new Date().toISOString(),
                inspectorBy: "",
                status: QUALITY_STATUS.PENDING,
                remark: "",
                tbQualityDetails: [createDetail()] // 👈 ใส่ detail เลย
            };

            return [...prev, newItem];
        });

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
            GROUP_QA.some((g) => getRoundTotalForGroup(r.id, g.group) > targetLimit + 0.001),
        );
    }, [rounds, values, targetLimit, getRoundTotalForGroup]);


    const handleSampleCountChange = (event: SelectChangeEvent<number>) => {
        setGlobalSampleCount(Number(event.target.value));
    };

    const saveDraft = async () => {
        setConfirmOpen(false);
        setIsLoading(true);
        try {
            let hasError = false;

            for (const item of qualityRequestList) {
                const data: QcInsertResponse = await qcService.insertQualityData(item);

                if (!data.isSuccess) {
                    hasError = true;
                    console.warn("Save failed:", item);
                }
            }

            if (hasError) {
                setIsLoading(false);
                alert("บันทึก Draft ไม่สำเร็จบางรายการ ❌");
            } else {

                window.location.reload(); // 🔥 refresh page
            }

        } catch (error) {
            setIsLoading(false);
            console.error("Error saving QC Check:", error);
            alert("เกิด error ระหว่างบันทึก ❌");
        }
    };


    const handleSubmit = async () => {
        setConfirmOpen(false);
        setIsLoading(true);

        try {
            let hasError = false;
            for (const item of qualityRequestList) {

                item.status = QUALITY_STATUS.COMPLETE;
                const data: QcInsertResponse = await qcService.insertQualityData(item);

                if (!data.isSuccess) {
                    hasError = true;
                    console.warn("Save failed:", item);
                }
            }
            if (hasError) {
                setIsLoading(false);
                alert("ส่งผลตรวจ ไม่สำเร็จบางรายการ ❌");
            } else {
                alert("ส่งผลตรวจ สำเร็จ ✅");
                window.location.reload(); // 🔥 refresh page
            }

        } catch (error) {
            setIsLoading(false);
            console.error("Error saving QC Check:", error);
            alert("เกิด error ระหว่างบันทึก ❌");
        }
    };



    const chooseTruck = async (truck: QcCheck) => {
        setSelectedTruck(truck);

        const res = await qcService.getQcByTicketCode(truck.sequenceId);
        if (!res?.data?.length) {
            // ถ้าไม่มีข้อมูล → reset state
            setValues({});
            setQualityRequestList([]);
            return;
        }

        const apiData: QualityRequest[] = (res.data as Quality[]).map(q => ({
            qualityId: q.id ?? 0, // default 0 ถ้าไม่มี
            qualityCode: q.qualityCode ?? "",
            qualityType: q.qualityType ?? "",
            planCode: q.planCode ?? "",
            docId: q.docId ?? "",
            docRefType: q.docRefType ?? "",
            inspectorDateTime: q.inspectorDateTime ?? new Date().toISOString(),
            inspectorBy: q.inspectorBy ?? "",
            status: q.status ?? QUALITY_STATUS.PENDING,
            remark: q.remark ?? "",
            tbQualityDetails: q.tbQualityDetails ?? [],
        }));


        setQualityRequestList(prev => {
            // merge ข้อมูลเก่าที่ user แก้ไว้
            return apiData.map(apiItem => {
                const oldItem = prev.find(p => p.qualityType === apiItem.qualityType);

                if (!oldItem) {
                    // ไม่มีข้อมูลเก่าของ group นี้ → ใช้ข้อมูล API เลย
                    return { ...apiItem, status: QUALITY_STATUS.PENDING };
                }

                // มีข้อมูลเก่า → merge tbQualityDetails
                const mergedDetails = apiItem.tbQualityDetails.map(detail => {
                    const oldDetail = oldItem.tbQualityDetails.find(d => d.qualityRuleCode === detail.qualityRuleCode);
                    return oldDetail ? { ...oldDetail } : detail;
                });

                return {
                    ...apiItem,
                    tbQualityDetails: mergedDetails,
                    status: QUALITY_STATUS.PENDING // set stage
                };
            });
        });

        // แปลง detail เป็น values สำหรับ form
        const allDetails = apiData.flatMap(q => q.tbQualityDetails);
        const mappedValues = mapQcToValues(allDetails);
        setValues(mappedValues);
    };



    const mapQcToValues = (qualityDetails: QualityDetail[]) => {
        const newValues: ValuesState = {};

        qualityDetails.forEach((d) => {
            // qualityRuleCode = "SIZE_DETAIL_R2_C1"
            const match = d.qualityRuleCode.match(/R(\d+)_C(\d+)/);
            console.log("match", match);
            if (match) {
                const rowId = parseInt(match[1], 10);  // R2 -> 2
                const colId = match[2];               // C1 -> "1" (criteriaId)
                newValues[`${colId}_${rowId}`] = String(d.dimensionValue);
                // setValues((prev) => ({ ...prev, [`${roundId}_${criteriaId}`]: val }));
            }
        });

        return newValues;
    };








    const prefillValuesFromApi = (qualities: Quality[]) => {
        const newValues: ValuesState = {};
        const newRemarks: RemarksState = {};

        qualities.forEach((q) => {
            q.tbQualityDetails.forEach((d) => {
                // ตัวอย่าง qualityRuleCode: "SIZE_DETAIL_R1_C1"
                const match = d.qualityRuleCode.match(/_R(\d+)_C(\d+)/);
                if (match) {
                    const roundId = parseInt(match[1], 10);
                    const criteriaId = match[2];
                    newValues[`${roundId}_${criteriaId}`] = String(d.dimensionValue);
                    if (d.remark) newRemarks[`${roundId}_${criteriaId}`] = d.remark;
                }
            });
        });

        setValues(newValues);
        setRowRemarks(newRemarks);
    };






    return {
        // states
        selectedTruck,
        globalSampleCount,
        rounds,
        values,
        rowRemarks,
        openSearch,
        isSearching,
        searchQuery,
        confirmOpen,
        isLoading,
        // filteredTrucks,
        hasValidationError,
        targetLimit,
        totalSamplesOverall,
        estimatedWeights,
        setEstimatedWeights,
        chooseTruck,
        // setters
        setSelectedTruck,
        setGlobalSampleCount,
        setRounds,
        setRowRemarks,
        setOpenSearch,
        setSearchQuery,
        setConfirmOpen,
        // functions
        handleValueChange,
        getRowTotal,
        getRoundTotalForGroup,
        handleSubmit,
        handleSampleCountChange,
        saveDraft,
        confirmAction,
        confirmConfig,
        setConfirmAction,
        setConfirmConfig
    };

}

