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
    sourceTypeCode: string;
    qaReceiveDate: string | null;
    qaReceiveDateTime: string | null;
    qaDepartDateTime: string | null;
}

export interface GetQcDetailResponse {
    poNo: string | null;
    regionCode: string | null;
    zoneCode: string | null;
    isReject: boolean | null;
    remark: string | null;
    dumperNo: string | null;
    no3Tag: boolean;
    userName: string | null;
    no3TagColor: string | null;
    sourceTypeCode: string | null;
    qaReceiveDate: string | null;
    qaReceiveDateTime: string | null;
    qaDepartDateTime: string | null;
}

export type QcDetailResponse = ApiResponse<null>;
export type GetQcDetailApiResponse = ApiResponse<GetQcDetailResponse>;
