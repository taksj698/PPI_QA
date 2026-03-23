import api from "@/lib/api";
import { QcCheckResponse } from "@/types/qcCheck.type";
import { QualityRequest } from "@/types/qualityRequest.type";

export const qcService = {
    async getQcCheck() {
        const response = await api.get<QcCheckResponse>("/TbQuality/qc-check");
        return response.data;
    },
    async insertQualityData(payload: QualityRequest) {
        const response = await api.post("/TbQuality", payload);
        return response.data;
    }
}; 