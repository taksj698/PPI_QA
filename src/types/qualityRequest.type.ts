// export type QualityType = "SIZE" | "WEIGHT" | "COLOR"; // เพิ่มตามจริง
// export type RefDocType = "WEIGHTDATA" | "PRICEDATA";   // เพิ่มตามจริง
// export type QualityStatus = "PENDING" | "APPROVED" | "REJECTED";



export interface TbQualityDetail {
  id: number;
  qualityId : number;
  qualityRuleCode: string;
  dimensionType: string;
  dimensionCode: string;
  dimensionValue: number | null;
  dimensionUnit: string | null;
  remark: string | null;
}

export interface QualityRequest {
  qualityId: number;
  qualityCode: string;
  qualityType: string;
  planCode: string;
  docId: string;
  docRefType: string;
  inspectorDateTime: string; // ISO string
  inspectorBy: string;
  status: string;
  remark: string;
  tbQualityDetails: TbQualityDetail[];
}