import { ProductModel } from "./product.model";

export class LoanModel {
    borrower: string;
    start: Date;
    end: Date;
    status: string;
    item: ProductModel;
  }
  