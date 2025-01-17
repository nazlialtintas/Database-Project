import {ProductDetail} from './ProductDetail';

export class ProductInfo {
    id: number;
    name: string;
    price: number;
    discountPrice: number;
    stock: number;
    description: string;
    avatarUrl: string;
    productStatus: number; // 0: onsale 1: offsale
    categoryName: string;
    popularity: number;
    createTime: string;
    updateTime: string;
    productDetailEntity: ProductDetail;
    productImages: string[];
   
    /*
    constructor() {
    
            this.id = 1;
            this.name = '';
            this.price = 20;
            this.stock = 100;
            this.description = '';
            this.avatarUrl = '';
            this.categoryName = 'Book';
            this.productStatus = 0;
    }
            */
}

