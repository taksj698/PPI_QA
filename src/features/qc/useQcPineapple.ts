import { SelectChangeEvent } from "@mui/material";
import { ASSESSMENT_CRITERIA, GROUP_QA } from "./constants"; //, MOCK_TRUCKS
import { useEffect, useMemo, useState } from "react";
import { QcCheck } from "@/types/qcCheck.type";
import { group } from "console";



export const useQcPineapple = () => {
    const [selectedTruck, setSelectedTruck] = useState<QcCheck | null>(null);
    const [globalSampleCount, setGlobalSampleCount] = useState<number>(10);
    const [rounds, setRounds] = useState<Round[]>(() => [
        { id: 1, name: "R1" },
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
    // const filteredTrucks = useMemo(() => {
    //     return MOCK_TRUCKS.filter(
    //         (t) =>
    //             t.plate.includes(searchQuery) ||
    //             t.supplier.toLowerCase().includes(searchQuery.toLowerCase()),
    //     );
    // }, [searchQuery]);

    // Simulation for Skeleton Loading
    // useEffect(() => {
    //     if (openSearch) {
    //         const timer = setTimeout(() => setIsSearching(false), 2000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [openSearch]);

    // useEffect(() => {
    //     initMockDraft();
    // }, []);


    // //fortest
    // const initMockDraft = () => {
    //     const mockRoundId = Date.now();

    //     // set truck
    //     setSelectedTruck({
    //         id: 1,
    //         plate: "1กก-1234",
    //         supplier: "Supplier Test"
    //     } as any);

    //     // set rounds
    //     setRounds([
    //         { id: mockRoundId, name: "R1" },
    //         { id: mockRoundId + 1, name: "R2" }
    //     ]);

    //     // set values (ต้องใช้ key แบบ roundId_criteriaId)
    //     const newValues: Record<string, string> = {};

    //     ASSESSMENT_CRITERIA.forEach((c) => {
    //         newValues[`${mockRoundId}_${c.id}`] = "1";
    //         newValues[`${mockRoundId + 1}_${c.id}`] = "2";
    //     });

    //     setValues(newValues);

    //     // set remarks
    //     const newRemarks: Record<string, string> = {};
    //     ASSESSMENT_CRITERIA.forEach((c) => {
    //         newRemarks[c.id] = "ทดสอบหมายเหตุ";
    //     });

    //     setRowRemarks(newRemarks);
    // };

    const handleValueChange = (
        groupName: string,
        roundId: number,
        criteriaId: string,
        val: string,
    ) => {
        console.log(`handleValueChange: group=${groupName}, roundId=${roundId}, criteriaId=${criteriaId}, val=${val}`);
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

    const handleAddRound = () => {
        setRounds((prev) => {
            const nextId = prev.length + 1;

            return [
                ...prev,
                {
                    id: nextId,
                    name: `R${nextId}`,
                },
            ];
        });
    };
    const handleRemoveRound = (id: number) => {
        setRounds((prevRounds) => {
            const filtered = prevRounds.filter((r) => r.id !== id);

            const reIndexed = filtered.map((r, index) => ({
                id: index + 1,
                name: `R${index + 1}`,
            }));

            return reIndexed;
        });

        // 👇 ลบค่าที่ผูกกับ round นี้ออกด้วย
        // setValues((prevValues) =>
        //     prevValues.filter((v) => v. !== id)
        // );
    };

    const buildQualityPayload = () => {
        const details: any[] = [];

        rounds.forEach((round, roundIndex) => {
            const rIndex = roundIndex + 1;

            // DETAIL (แต่ละช่อง)
            ASSESSMENT_CRITERIA.forEach((c, colIndex) => {
                const cIndex = colIndex + 1;
                const value = getNumericValue(round.id, c.id);

                details.push({
                    qualityRuleCode: `SIZE_DETAIL_R${rIndex}_C${cIndex}`,
                    dimensionType: "DETAIL",
                    dimensionCode: `DETAIL_R${rIndex}_C${cIndex}`,
                    dimensionValue: value,
                    dimensionUnit: "EACH",
                    remarkText: rowRemarks[c.id] || null
                });
            });

            // TOTAL ต่อรอบ
            const total = ASSESSMENT_CRITERIA.reduce(
                (sum, c) => sum + getNumericValue(round.id, c.id),
                0
            );

            details.push({
                qualityRuleCode: `SIZE_TOTAL${rIndex}`,
                dimensionType: "TOTAL",
                dimensionCode: `TOTAL${rIndex}`,
                dimensionValue: total,
                dimensionUnit: "EACH",
                remarkText: null
            });

            // AVG (%)
            const avg =
                totalSamplesOverall > 0
                    ? (total / totalSamplesOverall) * 100
                    : 0;

            details.push({
                qualityRuleCode: `SIZE_AVG${rIndex}`,
                dimensionType: "AVG",
                dimensionCode: `AVG${rIndex}`,
                dimensionValue: Number(avg.toFixed(2)),
                dimensionUnit: "PERCENT",
                remarkText: null
            });
        });

        return {
            qualityId: 0,
            qualityCode: "QC_SIZE_20260101_001",
            qualityType: "SIZE",
            planCode: "SIZE_20260101001",
            refDocType: "WEIGHTDATA",
            refDocId: "WD202601010001",
            inspectorDateTime: new Date().toISOString(),
            inspectorBy: 1001,
            status: "PENDING",
            remark: "Size check before pricing",
            tbQualityDetails: details
        };
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
        buildQualityPayload,
        // functions
        handleValueChange,
        getRowTotal,
        getRoundTotalForGroup,
        handleSubmit,
        handleSampleCountChange,
        handleAddRound,
        handleRemoveRound,
    };

}

