import { NgIf } from '@angular/common/src/directives/ng_if';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

// Routes
import { Router } from '@angular/router';
// Firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

// Models
import { ProductModel } from '../../models/product.model';


@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent implements OnInit {
addProductForm: FormGroup;
submitted = false;
isLogged = false;
product = {} as ProductModel;
products$: AngularFireList<any[]>;
products: any;

  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router, private afAuth: AngularFireAuth,
    private af: AngularFireDatabase, private afDb: AngularFireDatabase,
    private toastr: ToastrService) {
      this.product.name = '';
      this.product.cost = 0;
      this.product.available = true;
      this.product.category = '';

      this.createForm();

      // Authentication
      this.afAuth.authState.subscribe(auth => {
        if (auth) {
          this.isLogged = true;
          console.log("Got to add-product. We are logged in");
        } else {
          this.isLogged = false;
          console.log("Got to add-product but wasn't logged in");
          this.router.navigate(["/login"]);
        }
      });
      // Get products from database
      afDb.list('/products').valueChanges().subscribe(products => {
        this.products = products;
      });
  }

  ngOnInit() {}

  createForm() {
    this.addProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      cost: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  // Reference of addProductForm.controls
  get f() { return this.addProductForm.controls; }

  onSubmit() {
      this.submitted = true;
      if (this.addProductForm.invalid) {
        return;
      }

      this.product.name = this.f['name'].value;
      this.product.cost = this.f['cost'].value;
      this.product.category = this.f['category'].value;

      const productsRef = this.af.list('/products');
      productsRef.push(this.product).then(ref => {
        this.product.k = ref.key;
        this.afDb.object(`products/${ref.key}`).set(this.product).then(() => {
          this.toastr.success('', 'El producto se agregó con éxito', {
            timeOut: 5000
          });
          this.submitted = false;
          this.clearForm();
        }).catch(error => {
          this.errorMessage();
          console.log(error);
        });
      });
  }

  onDeleteProduct(id: any) {
    const product = this.afDb.object(`/products/${id}`);
    product.remove().then(() => {
      console.log('Eliminado con éxito');
      this.toastr.success('', 'Producto eliminado con éxito', {
        timeOut: 5000
      });
  }).catch(error => {
    this.errorMessage();
      console.log(error);
  });
  }

  clearForm() {
    this.addProductForm.reset();
    this.f['category'].setValue('');
  }

  errorMessage() {
    this.toastr.error('Error inesperado', 'Se ha producido un error, volver a intentarlo', {
      timeOut: 5000
    });
  }
}
