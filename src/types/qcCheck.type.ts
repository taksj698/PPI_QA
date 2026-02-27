import { ApiResponse } from "./api.types";

export interface QcCheck {
    logid: number;
    ticketOutCode: string;
    plate: string;
    inboundDate: string | null;
    outboundDate: string | null;
    inboundWeight: number | null;
    outboundWeight: number | null;
    grossWeight: number | null;
    qcState: boolean | null;
    truckTypeName: string | null;
    companyName: string | null;
}

export type QcCheckResponse = ApiResponse<QcCheck>;