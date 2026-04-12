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


const getLocalISOString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString();
};

export const useQcPineapple = () => {
    const [inspectorBy] = useState<string>(() => {
        try {
            const user = localStorage.getItem("user");
            if (user) {
                const userData = JSON.parse(user);
                return userData.fullUserName || "";
            }
        } catch (e) {
            console.error("Error parsing user data", e);
        }
        return "";
    });

    const [selectedTruck, setSelectedTruck] = useState<QcCheck | null>(null);
    const [globalSampleCount, setGlobalSampleCount] = useState<number>(10);
    const [rounds, setRounds] = useState<Round[]>(() => [
        { id: 1, name: "R1" },
        { id: 2, name: "R2" },
        { id: 3, name: "R3" },
        { id: 4, name: "R4" },
        { id: 5, name: "R5" },
        { id: 6, name: "R6" },
        { id: 7, name: "R7" },
        { id: 8, name: "R8" },
        { id: 9, name: "R9" },
    ]);
    const [values, setValues] = useState<ValuesState>({});
    const [rowRemarks, setRowRemarks] = useState<RemarksState>({});
    const [estimatedWeights, setEstimatedWeights] = useState<EstimatedWeightState>({});
    const [nitrateSampleCounts, setNitrateSampleCounts] = useState<Record<string, number>>({});
    const [nitrateOptions, setNitrateOptions] = useState<number[]>([3, 6, 9, 12, 15, 18]);

    useEffect(() => {
        qcService.getNitrateConfig().then((res) => {
            const config = res.data.find((c) => c.name === "NITRATE_QUALITY_RANDOM");
            if (config) {
                try {
                    const parsed = JSON.parse(config.value) as number[];
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setNitrateOptions(parsed);
                    }
                } catch {
                    // ใช้ค่า default ถ้า parse ไม่ได้
                }
            }
        }).catch(() => {/* ใช้ค่า default */});
    }, []);

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
            (sum, r) => {
                const val = values[`${r.id}_${criteriaId}`];
                if (val === "" || val === undefined) return sum;
                return sum + (parseFloat(val) || 0);
            },
            0,
        );
    };

    // ช่วง rounds สำหรับ section: 1 → [1,2], 2 → [3,4], 3 → [5,6]
    const getSectionRounds = (sectionNum: number): number[] => {
        const startIdx = (sectionNum - 1) * 2;
        return [rounds[startIdx]?.id, rounds[startIdx + 1]?.id].filter((id) => id !== undefined) as number[];
    };

    // แบ่ง section แต่ละ 2 rounds
    const getSectionCriteria = (sectionNum: number): string[] => {
        const criteriaByGroup = ASSESSMENT_CRITERIA.filter((c) => c.group === "NITRATE").map((c) => c.id);
        // เลือกเกณฑ์ NITRATE ตัวแรกเท่านั้น
        return [criteriaByGroup[0]].filter((id) => id !== undefined);
    };

    // คำนวณค่าเฉลี่ยของ section (ผลรวม / จำนวนลูกที่สุ่มได้)
    const getSectionAverage = (sectionNum: number): number => {
        const roundRange = getSectionRounds(sectionNum);
        const criteria = getSectionCriteria(sectionNum);

        let sum = 0;
        roundRange.forEach((roundId) => {
            criteria.forEach((criteriaId) => {
                const val = values[`${roundId}_${criteriaId}`];
                if (val && val !== "") {
                    sum += parseFloat(val) || 0;
                }
            });
        });

        return globalSampleCount > 0 ? sum / globalSampleCount : 0;
    };

    const targetLimit = globalSampleCount;
    const totalSamplesOverall = rounds.length * targetLimit;

    const hasValidationError = useMemo(() => {
        return rounds.some((r) =>
            GROUP_QA.filter((g) => g.group !== "NITRATE").some((g) => getRoundTotalForGroup(r.id, g.group) > targetLimit + 0.001),
        );
    }, [rounds, values, targetLimit, getRoundTotalForGroup]);


    const handleSampleCountChange = (event: SelectChangeEvent<number>) => {
        setGlobalSampleCount(Number(event.target.value));
    };





    const NITRATE_PAIR_CONFIG = [
        { key: "23-24", pairSuffix: "12", itemIds: ["23", "24"] },
        { key: "25-26", pairSuffix: "34", itemIds: ["25", "26"] },
        { key: "27-28", pairSuffix: "56", itemIds: ["27", "28"] },
    ];

    const calcNitrateAvg = (pairItemIds: string[], sampleCount: number, overrideValues?: ValuesState): number | null => {
        const src = overrideValues ?? values;
        const vals = rounds
            .flatMap(r => pairItemIds.map(id => src[`${r.id}_${id}`]))
            .filter(v => v !== undefined && v !== "")
            .map(v => parseFloat(v as string))
            .filter(n => !Number.isNaN(n));
        if (!vals.length || sampleCount <= 0) return null;
        return parseFloat((vals.reduce((sum, n) => sum + n, 0) / sampleCount).toFixed(2));
    };

    const handleNitrateSampleCountChange = (key: string, value: number) => {
        setNitrateSampleCounts(prev => ({ ...prev, [key]: value }));

        const pairConfig = NITRATE_PAIR_CONFIG.find(p => p.key === key);
        if (!pairConfig) return;

        const randomDetail: TbQualityDetail = {
            id: 0, qualityId: 0,
            qualityRuleCode: `NITRATE_${DIMENSION_TYPE.RANDOM}${pairConfig.pairSuffix}`,
            dimensionType: DIMENSION_TYPE.RANDOM,
            dimensionCode: `${DIMENSION_TYPE.RANDOM}${pairConfig.pairSuffix}`,
            dimensionValue: value > 0 ? value : null,
            dimensionUnit: DIMENSION_UNIT.EACH,
            remark: null
        };

        const avgValue = calcNitrateAvg(pairConfig.itemIds, value);
        const avgDetail: TbQualityDetail = {
            id: 0, qualityId: 0,
            qualityRuleCode: `NITRATE_${DIMENSION_TYPE.AVG}${pairConfig.pairSuffix}`,
            dimensionType: DIMENSION_TYPE.AVG,
            dimensionCode: `${DIMENSION_TYPE.AVG}${pairConfig.pairSuffix}`,
            dimensionValue: avgValue,
            dimensionUnit: DIMENSION_UNIT.PPM,
            remark: null
        };

        updateDetails("NITRATE", [randomDetail, avgDetail]);
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
            inspectorDateTime: q.inspectorDateTime ?? getLocalISOString(new Date()),
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
        setRowRemarks(mapQcToRemarks(allDetails));
        setEstimatedWeights(mapEstimatedWeights(allDetails));
        setValues(mappedValues);
    };



    const mapQcToValues = (
        qualityDetails: (QualityDetail | TbQualityDetail)[]
    ) => {
        const newValues: ValuesState = {};

        qualityDetails.forEach((d) => {
            const match = d.qualityRuleCode.match(/R(\d+)_C(\d+)/);

            if (match) {
                const rowId = parseInt(match[1], 10);
                const colId = match[2];

                newValues[`${colId}_${rowId}`] =
                    d.dimensionValue !== null
                        ? String(d.dimensionValue)
                        : "";
            }
        });

        return newValues;
    };
    const mapQcToRemarks = (
        qualityDetails: (QualityDetail | TbQualityDetail)[]
    ) => {
        const newRemarks: RemarksState = {};

        qualityDetails.forEach((d) => {
            if (d.dimensionType === DIMENSION_TYPE.REMARK) {
                const match = d.qualityRuleCode.match(/R(\d+)_C(\d+)/);

                if (match) {
                    const rowId = parseInt(match[1], 10);
                    const colId = match[2];
                    newRemarks[`${colId}_${rowId}`] = d.remark || "";
                }
            }
        });

        return newRemarks;
    };
    const mapEstimatedWeights = (
        qualityDetails: (QualityDetail | TbQualityDetail)[]
    ) => {
        const newEstimatedWeights: EstimatedWeightState = {};

        qualityDetails.forEach((d) => {
            if (d.dimensionType === DIMENSION_TYPE.ESTIMATE) {
                const match = d.qualityRuleCode.match(/R(\d+)_C(\d+)/);

                if (match) {
                    const rowId = parseInt(match[1], 10);
                    const colId = match[2];
                    newEstimatedWeights[`${colId}_${rowId}`] = d.remark || "";
                }
            }
        });

        return newEstimatedWeights;
    };







    // const prefillValuesFromApi = (qualities: Quality[]) => {
    //     const newValues: ValuesState = {};
    //     const newRemarks: RemarksState = {};

    //     qualities.forEach((q) => {
    //         q.tbQualityDetails.forEach((d) => {
    //             // ตัวอย่าง qualityRuleCode: "SIZE_DETAIL_R1_C1"
    //             const match = d.qualityRuleCode.match(/_R(\d+)_C(\d+)/);
    //             if (match) {
    //                 const roundId = parseInt(match[1], 10);
    //                 const criteriaId = match[2];
    //                 newValues[`${roundId}_${criteriaId}`] = String(d.dimensionValue);
    //                 if (d.remark) newRemarks[`${roundId}_${criteriaId}`] = d.remark;
    //             }
    //         });
    //     });

    //     setValues(newValues);
    //     setRowRemarks(newRemarks);
    // };



    const handleValueChange = (
        groupName: string,
        roundId: number,
        criteriaId: string,
        val: string,
    ) => {
        const newValues = { ...values, [`${roundId}_${criteriaId}`]: val };
        setValues(newValues);

        const unit = groupName === "NITRATE" ? DIMENSION_UNIT.PPM : DIMENSION_UNIT.EACH;
        const detailsToUpdate: TbQualityDetail[] = [];

        // DETAIL record
        detailsToUpdate.push(createDetail(
            buildCode(groupName, DIMENSION_TYPE.DETAIL, criteriaId, roundId),
            DIMENSION_TYPE.DETAIL,
            unit,
            val
        ));

        // NITRATE: บันทึก AVG ของ pair ที่เกี่ยวข้อง
        if (groupName === "NITRATE") {
            const pairConfig = NITRATE_PAIR_CONFIG.find(p => p.itemIds.includes(criteriaId));
            if (pairConfig) {
                const sampleCount = nitrateSampleCounts[pairConfig.key] || nitrateOptions[0];
                const avgValue = calcNitrateAvg(pairConfig.itemIds, sampleCount, newValues);
                detailsToUpdate.push({
                    id: 0, qualityId: 0,
                    qualityRuleCode: `NITRATE_${DIMENSION_TYPE.AVG}${pairConfig.pairSuffix}`,
                    dimensionType: DIMENSION_TYPE.AVG,
                    dimensionCode: `${DIMENSION_TYPE.AVG}${pairConfig.pairSuffix}`,
                    dimensionValue: avgValue,
                    dimensionUnit: DIMENSION_UNIT.PPM,
                    remark: null
                });
            }
        }

        // TOTAL + AVG records สำหรับ group อื่น ๆ
        if (groupName !== "NITRATE") {
            const groupCriteria = ASSESSMENT_CRITERIA.filter(c => c.group === groupName);

            const rowTotals = groupCriteria.map(c => ({
                id: c.id,
                total: rounds.reduce((sum, r) => {
                    const v = newValues[`${r.id}_${c.id}`];
                    return sum + (v && v !== "" ? parseFloat(v) || 0 : 0);
                }, 0)
            }));

            const groupTotal = rowTotals.reduce((sum, rt) => sum + rt.total, 0);

            groupCriteria.forEach(c => {
                const rt = rowTotals.find(r => r.id === c.id)!;
                const apiGroup = getApiGroupName(groupName);
                const idx = getWithinGroupIndex(groupName, c.id);

                // TOTAL
                detailsToUpdate.push({
                    id: 0,
                    qualityId: 0,
                    qualityRuleCode: `${apiGroup}_${DIMENSION_TYPE.TOTAL}${idx}`,
                    dimensionType: DIMENSION_TYPE.TOTAL,
                    dimensionCode: `${DIMENSION_TYPE.TOTAL}${idx}`,
                    dimensionValue: rt.total > 0 ? rt.total : null,
                    dimensionUnit: DIMENSION_UNIT.EACH,
                    remark: null
                });

                // AVG (%)
                const pct = groupTotal > 0 ? parseFloat(((rt.total / groupTotal) * 100).toFixed(2)) : null;
                detailsToUpdate.push({
                    id: 0,
                    qualityId: 0,
                    qualityRuleCode: `${apiGroup}_${DIMENSION_TYPE.AVG}${idx}`,
                    dimensionType: DIMENSION_TYPE.AVG,
                    dimensionCode: `${DIMENSION_TYPE.AVG}${idx}`,
                    dimensionValue: pct && pct > 0 ? pct : null,
                    dimensionUnit: DIMENSION_UNIT.PERCENT,
                    remark: null
                });
            });
        }

        updateDetails(groupName, detailsToUpdate);
    };
    const handleRemarkChange = (
        groupName: string,
        roundId: number,
        criteriaId: string,
        val: string
    ) => {
        // เก็บลง state UI
        setRowRemarks(prev => ({
            ...prev,
            [`${roundId}_${criteriaId}`]: val
        }));

        const code = buildCode(
            groupName,
            DIMENSION_TYPE.REMARK,
            criteriaId,
            roundId
        );

        const detail = createDetail(
            code,
            DIMENSION_TYPE.REMARK,
            null, // 👈 หรือ "" ก็ได้
            null,
            val
        );

        updateDetail(groupName, detail);
    };

    const handleEstimatedWeightsChange = (
        groupName: string,
        roundId: number,
        criteriaId: string,
        val: string
    ) => {
        // เก็บลง state UI
        setEstimatedWeights(prev => ({
            ...prev,
            [`${roundId}_${criteriaId}`]: val
        }));

        const code = buildCode(
            groupName,
            DIMENSION_TYPE.ESTIMATE,
            criteriaId,
            roundId
        );

        const detail = createDetail(
            code,
            DIMENSION_TYPE.ESTIMATE,
            null, // 👈 หรือ "" ก็ได้
            null,
            val
        );

        updateDetail(groupName, detail);
    };
    // action handlers
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

                const payload = { ...item, status: QUALITY_STATUS.COMPLETE };
                const data: QcInsertResponse = await qcService.insertQualityData(payload);

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
    // main functions for create/update qualityRequestList
    const getApiGroupName = (group: string) => group === "FLAW" ? "OTHER" : group;

    const getWithinGroupIndex = (group: string, criteriaId: string): number => {
        const groupCriteria = ASSESSMENT_CRITERIA.filter(c => c.group === group);
        return groupCriteria.findIndex(c => c.id === criteriaId) + 1;
    };

    const buildCode = (
        group: string,
        type: string,
        criteriaId: string,
        roundId: number
    ) => `${getApiGroupName(group)}_${type}_R${criteriaId}_C${roundId}`;

    const createDetail = (
        qualityRuleCode: string,
        dimensionType: string,
        dimensionUnit: string | null,
        value: any,
        remark?: string
    ): TbQualityDetail => {
        const isTextType =
            dimensionType === DIMENSION_TYPE.REMARK ||
            dimensionType === DIMENSION_TYPE.ESTIMATE;

        return {
            id: 0,
            qualityId: 0,
            qualityRuleCode,
            dimensionType,
            dimensionCode: qualityRuleCode,
            dimensionValue: isTextType
                ? null
                : value === "" || value === null || isNaN(Number(value))
                    ? null
                    : Number(value),
            dimensionUnit,
            remark: isTextType ? (remark ?? value ?? "") : null
        };
    };
    const updateDetail = (groupName: string, detail: TbQualityDetail) => {
        updateDetails(groupName, [detail]);
    };

    const updateDetails = (groupName: string, details: TbQualityDetail[]) => {
        setQualityRequestList(prev => {
            const index = prev.findIndex(item => item.qualityType === groupName);
            const dateformat = getLocalISOString(new Date()).slice(0, 10).replace(/-/g, "");

            let baseItem: QualityRequest;
            let currentDetails: TbQualityDetail[];

            if (index === -1) {
                baseItem = {
                    qualityId: 0,
                    qualityCode: `QC_${groupName}_${dateformat}`,
                    qualityType: groupName,
                    planCode: `${groupName}_${dateformat}`,
                    docId: selectedTruck?.sequenceId || "",
                    docRefType: DOC_TYPE.WEIGHTDATA,
                    inspectorDateTime: getLocalISOString(new Date()),
                    inspectorBy: inspectorBy,
                    status: QUALITY_STATUS.PENDING,
                    remark: "",
                    tbQualityDetails: []
                };
                currentDetails = [];
            } else {
                baseItem = { ...prev[index], inspectorDateTime: getLocalISOString(new Date()) };
                currentDetails = [...(baseItem.tbQualityDetails || [])];
            }

            let newDetails = [...currentDetails];

            for (const detail of details) {
                const isTextType =
                    detail.dimensionType === DIMENSION_TYPE.REMARK ||
                    detail.dimensionType === DIMENSION_TYPE.ESTIMATE;
                const isEmpty = isTextType
                    ? !(detail.remark ?? "").trim()
                    : detail.dimensionValue === null;

                const detailIndex = newDetails.findIndex(d => d.qualityRuleCode === detail.qualityRuleCode);

                if (isEmpty) {
                    if (detailIndex !== -1) newDetails.splice(detailIndex, 1);
                } else {
                    if (detailIndex !== -1) {
                        newDetails[detailIndex] = { ...newDetails[detailIndex], ...detail };
                    } else {
                        newDetails.push(detail);
                    }
                }
            }

            const updatedItem = { ...baseItem, tbQualityDetails: newDetails };

            if (index === -1) {
                return [...prev, updatedItem];
            } else {
                const updated = [...prev];
                updated[index] = updatedItem;
                return updated;
            }
        });
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
        handleNitrateSampleCountChange,
        nitrateSampleCounts,
        nitrateOptions,
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
    };

}

