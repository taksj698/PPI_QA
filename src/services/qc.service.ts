import api from "@/lib/api";
import { QcCheckResponse } from "@/types/qcCheck.type";

export const qcService = {
    async getQcCheck() {
        const response = await api.get<QcCheckResponse>("/TbQuality/qc-check");
        return response.data;
    },
}; 