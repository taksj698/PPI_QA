import { ApiResponse } from "./api.types";

export interface Quality {
    id: number;
    qualityCode: string;
    qualityType: string;
    planCode: string;
    docId: string;
    docRefType: string;
    inspectorDateTime: string; // หรือ Date ถ้าจะ parse
    inspectorBy: string;
    status: string;
    remark: string | null;
    createDate: string | null;
    createBy: string | null;
    modifyDate: string | null;
    modifyBy: string | null;
    tbQualityDetails: QualityDetail[];
}


export interface QualityDetail {
    id: number;
    qualityId: number;
    qualityRuleCode: string;
    dimensionType: string;
    dimensionCode: string;
    dimensionValue: number;
    dimensionUnit: string;
    remark: string | null;
}



export type QcInsertResponse = ApiResponse<Quality>;

