export interface QcMasterItem {
  code: string;
  name: string;
}

export interface QcMasterData {
  sourceZones: QcMasterItem[];
  sourceTypes: QcMasterItem[];
  sourceRegions: QcMasterItem[];
  sourceDumpers: QcMasterItem[];
}

export interface QcMasterResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  responseDateTime: string;
  data: QcMasterData;
}
