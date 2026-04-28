export interface TbProductItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  priceCost: number | null;
  unitId: string;
  inActive: boolean;
  promotionApply: boolean;
}

export interface TbProductResponse {
  isSuccess: boolean;
  statusCode: number;
  message: string;
  responseDateTime: string;
  data: TbProductItem[];
}
