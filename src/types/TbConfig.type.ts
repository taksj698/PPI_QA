import { ApiResponse } from "./api.types";

export interface TbConfig {
    id: number;
    name: string;
    value: string;
    desc: string;
    type: string;
}




export type TbConfigResponse = ApiResponse<TbConfig[]>;