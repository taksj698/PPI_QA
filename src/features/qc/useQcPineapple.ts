import { SelectChangeEvent } from "@mui/material";
import { ASSESSMENT_CRITERIA, DIMENSION_TYPE, DIMENSION_UNIT, DOC_TYPE, GROUP_QA, QUALITY_STATUS } from "./constants"; //, MOCK_TRUCKS
import { useEffect, useMemo, useState } from "react";
import { QcCheck } from "@/types/qcCheck.type";
import { group } from "console";
import { QualityRequest, TbQualityDetail } from "@/types/qualityRequest.type";
import { stringify } from "querystring";
import { qcService } from "@/services/qc.service";



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

    // UI States
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
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

    const handleSubmit = async () => {
        setConfirmOpen(false);
        setIsLoading(true);
        // Simulate API Call
        await new Promise((r) => setTimeout(r, 1500));
        setIsLoading(false);
        setSelectedTruck(null);
        setRounds([{ id: 1, name: "R1" }]);
        setValues({});
        setSearchQuery("");
    };

    const handleSampleCountChange = (event: SelectChangeEvent<number>) => {
        setGlobalSampleCount(Number(event.target.value));
    };

    const saveDraft = async () => {
        try {
            for (const item of qualityRequestList) {
                console.log("Saving item:", item);
                const data: any = await qcService.insertQualityData(item);

                if (data.isSuccess) {
                    console.log("Draft saved successfully:", item);
                } else {
                    console.warn("Save failed:", item);
                }
            }
        } catch (error) {
            console.error("Error saving QC Check:", error);
        }
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
        saveDraft
    };

}

