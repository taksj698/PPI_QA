import { ApiResponse } from "./api.types";
import { Quality } from "./qcInsert.type";

export type QcTicketResponse = ApiResponse<Quality[]>;