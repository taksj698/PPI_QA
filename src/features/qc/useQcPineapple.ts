import { SelectChangeEvent } from "@mui/material";
import { ASSESSMENT_CRITERIA, GROUPS, MOCK_TRUCKS } from "./constants";
import { useEffect, useMemo, useState } from "react";



export const useQcPineapple = () => {
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
        filteredTrucks,
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
        handleSampleCountChange
    };

}

