// export type QualityType = "SIZE" | "WEIGHT" | "COLOR"; // เพิ่มตามจริง
// export type RefDocType = "WEIGHTDATA" | "PRICEDATA";   // เพิ่มตามจริง
// export type QualityStatus = "PENDING" | "APPROVED" | "REJECTED";



export interface TbQualityDetail {
  qualityRuleCode: string;
  dimensionType: string;
  dimensionCode: string;
  dimensionValue: number;
  dimensionUnit: string;
  remarkText: string | null;
}

export interface QualityRequest {
  qualityId: number;
  qualityCode: string;
  qualityType: string;
  planCode: string;
  refDocType: string;
  refDocId: string;
  inspectorDateTime: string; // ISO string
  inspectorBy: string;
  status: string;
  remark: string;
  tbQualityDetails: TbQualityDetail[];
}