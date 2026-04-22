import api from "@/lib/api";
import { QcCheckResponse } from "@/types/qcCheck.type";
import { GetQcDetailApiResponse, QcDetailRequest, QcDetailResponse } from "@/types/qcDetail.type";
import { QcInsertResponse } from "@/types/qcInsert.type";
import { QcTicketResponse } from "@/types/QcResponse.type";
import { QualityRequest } from "@/types/qualityRequest.type";
import { TbConfigResponse } from "@/types/TbConfig.type";
import { QcMasterResponse } from "@/types/qcMaster.type";

export interface EpicorPoItem {
    poHeader_OrderDate: string;
    poHeader_PONum: number;
    vendor_VendorID: string;
    vendor_Name: string;
    vendor_Address1: string | null;
    vendor_Address3: string | null;
    vendor_City: string | null;
    vendor_State: string | null;
    vendor_ZIP: string | null;
    purAgent_Name: string | null;
    poHeader_PPI_IsPurchaseStation_c: boolean;
    poHeader_PPI_CarID_c: string | null;
    cartype_CodeDesc: string | null;
    poHeader_PPI_CarIDStation_c: string | null;
    udCodes_CodeDesc: string | null;
    rowIdent: string;
}

export interface EpicorPoResponse {
    data: { odatacontext: string; value: EpicorPoItem[] };
    isSuccess: boolean;
    statusCode: number;
    message: string;
    responseDateTime: string;
}



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
    async getQcDetail(sequenceId: string): Promise<GetQcDetailApiResponse> {
        const response = await api.post<GetQcDetailApiResponse>("/TbQuality/get-qc-detail", { sequenceId });
        return response.data;
    },
    async getEpicorPo(): Promise<EpicorPoResponse> {
        const response = await api.get<EpicorPoResponse>("/Epicor/po");
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