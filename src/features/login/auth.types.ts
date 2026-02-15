import { ApiResponse } from "@/types/api.types";

export interface LoginData {
  userData: UserData;
  token: string;
  expiredMessage: string;
  menu: unknown | null;
  reportGroup: unknown | null;
  report: unknown | null;
  userRole: unknown | null;
}

export interface UserData {
  userId: number;
  userName: string;
  password1: string;
  fullUserName: string;
  inActive: boolean;
  createDate: string;
  createBy: string;
  expiredDate: string;
  lastedDate: string;
  modifyDate: string;
  modifyBy: string;
  printCount: number;
  branchId: string;
  sourceSystem: string;
  language: string;
  roleId: number;
  tbUserRoles: unknown | null;
  branchName: string | null;
  branchCode: string | null;
}

export interface LoginRequest {
  userName: string;
  password1: string;
  companyId: string ;
  branchId: string;
}

export type LoginResponse = ApiResponse<LoginData>;
