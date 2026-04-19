import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";
import { QcCheckResponse } from "@/types/qcCheck.type";
import { QcDetailRequest, QcDetailResponse } from "@/types/qcDetail.type";
import { QcInsertResponse } from "@/types/qcInsert.type";
import { QcTicketResponse } from "@/types/QcResponse.type";
import { QualityRequest } from "@/types/qualityRequest.type";
import { TbConfigResponse } from "@/types/TbConfig.type";
import { QcMasterResponse } from "@/types/qcMaster.type";



export const qcService = {
    async getQcCheck() {
        const response = await api.get<QcCheckResponse>("/TbQuality/qc-check");
        return response.data;
    },
    async insertQualityData(payload: QualityRequest) {
        const response = await api.post<QcInsertResponse>("/TbQuality", payload);
        return response.data;
    },
    async updateQualityData(payload: QualityRequest) {
        const response = await api.put<QcInsertResponse>("/TbQuality", payload);
        return response.data;
    },
    async getNitrateConfig(): Promise<TbConfigResponse> {
        const response = await api.get<TbConfigResponse>("/TbConfig/type/NITRATE");
        return response.data;
    },
    async saveQcDetail(payload: QcDetailRequest): Promise<QcDetailResponse> {
        const response = await api.post<QcDetailResponse>("/TbQuality/qc-detail", payload);
        return response.data;
    },
    async getQcMaster(): Promise<QcMasterResponse> {
        const response = await api.get<QcMasterResponse>("/TbQuality/qc-master");
        return response.data;
    },
    async getQcByTicketCode(ticketCode: string): Promise<QcTicketResponse> {
        try {
            const response = await api.get<QcTicketResponse>(`/TbQuality/ticketcode/${ticketCode}`);
            return response.data;
        } catch (error: unknown) {
            // ถ้า 404 → return default empty structure
            if ((error as { response?: { status?: number } }).response?.status === 404) {
                return {
                    isSuccess: true,
                    data: [], // ไม่มีข้อมูล
                    message: "No data found",
                    statusCode: 404,
                    responseDateTime: new Date().toISOString(),
                };
            }
            // ถ้า error อื่น ๆ → throw ปกติ
            throw error;
        }
    }

}; 


//setNitrateSampleCounts NITRATE_QUALITY_RANDOM