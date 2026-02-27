export type QualityType = "SIZE" | "WEIGHT" | "COLOR"; // เพิ่มตามจริง
export type RefDocType = "WEIGHTDATA" | "PRICEDATA";   // เพิ่มตามจริง
export type QualityStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DimensionType =
  | "DETAIL"
  | "RANDOM"
  | "REMARK"
  | "AVG"
  | "TOTAL"
  | "PERCENT"
  | "ESTIMATE";

export type DimensionUnit =
  | "PPM"
  | "PERCENT"
  | "KG"
  | "EACH";

export interface TbQualityDetail {
  qualityRuleCode: string;
  dimensionType: DimensionType;
  dimensionCode: string;
  dimensionValue: number;
  dimensionUnit: DimensionUnit;
  remarkText: string | null;
}

export interface QualityRequest {
  qualityId: number;
  qualityCode: string;
  qualityType: QualityType;
  planCode: string;
  refDocType: RefDocType;
  refDocId: string;
  inspectorDateTime: string; // ISO string
  inspectorBy: number;
  status: QualityStatus;
  remark: string;
  tbQualityDetails: TbQualityDetail[];
}