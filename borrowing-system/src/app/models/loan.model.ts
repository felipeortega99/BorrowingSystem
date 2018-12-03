import { ProductModel } from "./product.model";

export class LoanModel {
  k: string;
  borrower_name: string;
  borrower_id: string;
  start: Date;
  end: Date;
  status: string;
  item: ProductModel;
}
