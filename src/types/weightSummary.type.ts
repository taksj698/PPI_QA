export interface WeightSummaryDetail {
  id: number;
  weightSummaryId: number;
  productId: number;
  grossWeight: number;
}

export interface WeightSummaryData {
  id: number;
  docId: string;
  tbWeightSummaryDetails: WeightSummaryDetail[];
}

export interface WeightSummaryResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  responseDateTime: string;
  data: WeightSummaryData | null;
}
