import { ProductInfo } from "./ProductInfo";

export class ShoppingCardItemEntity {
    id: number;
    productEntity: ProductInfo;
    count: number;
    price: number;


    constructor(productEntity?: ProductInfo, count?: number) {
        this.count = count;
        this.productEntity = productEntity;
    }


}