import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { LoanModel } from '../../models/loan.model';
import { ToastrService } from 'ngx-toastr';
// Models
import { ProductModel } from '../../models/product.model';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  rentProductForm: FormGroup;
  submitted = false;
  isLogged = false;
  products: any[];
  private product = {} as ProductModel;
  products$: AngularFireList<any[]>;
  private loan = {} as LoanModel;
  date = new Date();
  // set borrow time
  borrowTime = 1;

  constructor(
    private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router, private afAuth: AngularFireAuth, private afDb: AngularFireDatabase,
    private toastr: ToastrService, private af: AngularFireDatabase) {
      this.afAuth.authState.subscribe(auth => {
        if (auth) {
          this.isLogged = true;
          console.log('Got to home. We are logged in');
          this.loadData();
          this.product.name = '';
      this.product.cost = 0;
      this.product.available = true;
      this.product.category = '';
      this.loan.borrower_id = '';
      this.loan.borrower_name = '';
      this.loan.start = this.date.getDate().toString();
      this.loan.end = (this.date.getDate() + this.borrowTime).toString();
      this.loan.status = 'onTime';
  
      this.createForm();
        } else {
          this.isLogged = false;
          console.log('Got to home but wasn\'t logged in');
          this.router.navigate(["/login"]);
        }
      });      
  }

  ngOnInit() {}

  loadData() {
    // Get available products
    this.afDb
      .list("/products", ref => ref.orderByChild("available").equalTo(true))
      .valueChanges()
      .subscribe(products => {
        this.products = products;
      });
  }

  createForm() {
    this.rentProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      studentNumber: ['', Validators.required],
      productName: ['', Validators.required]
    });
  }

  get f() {
    return this.rentProductForm.controls;
  }

  onSubmit(id) {
    this.submitted = true;
    if (this.rentProductForm.invalid) {
      return;
    }

    // tslint:disable-next-line:triple-equals
    this.product = this.products.find(p => p.name == this.f['productName'].value);
    this.loan.borrower_name = this.f['name'].value;
    this.loan.borrower_id = this.f['studentNumber'].value;
    this.product.available = false;
    this.loan.item = this.product;

    const productsRef = this.af.list('/loans');
      productsRef.push(this.loan).then(ref => {
        this.loan.k = ref.key;
        this.afDb.object(`loans/${ref.key}`).set(this.loan).then(() => {
          this.updateProduct(this.product);
          this.successMessage('La renta se realizó con éxito');
          this.submitted = false;
          this.clearForm();
        }).catch(error => {
          this.errorMessage();
          console.log(error);
        });
      });
  }

  updateProduct(product: ProductModel) {
    this.af.object(`/products/'${product.k}`)
    .update({ available: false, category: product.category, cost: product.cost, k: product.k, name: product.name});
  }

  errorMessage() {
    this.toastr.error('Error inesperado', 'Se ha producido un error, volver a intentarlo', {
      timeOut: 5000
    });
  }

  successMessage(message: string) {
    this.toastr.success('', message, {
      timeOut: 5000
    });
  }

  clearForm() {
    this.rentProductForm.reset();
    this.f['productName'].setValue('');
  }
}
