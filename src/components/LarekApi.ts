import { Api, ApiListResponse } from './base/api';
import {IOrder, IOrderResult, IApi, IProduct} from "../types";

export class LarekAPI extends Api implements IApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  getProductItem(id: string): Promise<IProduct> {
      return this.get(`/product/${id}`).then(
          (item: IProduct) => ({
              ...item,
              image: this.cdn + item.image.replace(".svg", ".png"),
          })
      );
  }

  getProductList(): Promise<IProduct[]> {
      return this.get('/product').then((data: ApiListResponse<IProduct>) =>
          data.items.map((item) => ({
              ...item,
              image: this.cdn + item.image.replace(".svg", ".png")
          }))
      );
  }

  orderProducts(order: IOrder): Promise<IOrderResult> {
      return this.post('/order', order).then(
          (data: IOrderResult) => data
      );
  }

}