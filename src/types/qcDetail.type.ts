import { ApiResponse } from "./api.types";

export interface QcDetailRequest {
    docId: string;
    poNo: string;
    regionCode: string;
    zoneCode: string;
    isReject: boolean;
    remark: string;
    dumperNo: string;
    no3Tag: boolean;
    userName: string;
    no3TagColor: string;
    qoReceiveDateTime: string;   // ISO string
    qoReceiveDateTimeTime: string; // ISO string
    qoReportDateTime: string;    // ISO string
}

export type QcDetailResponse = ApiResponse<null>;
