import { NgIf } from "@angular/common/src/directives/ng_if";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ToastrService } from "ngx-toastr";

// Routes
import { Router } from "@angular/router";
// Firebase
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase, AngularFireList } from "@angular/fire/database";

// Models
import { ProductModel } from "../../models/product.model";
import { CategoryModel } from "../../models/category.model";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent implements OnInit {
  addProductForm: FormGroup;
  addCategoryForm: FormGroup;
  submittedC = false;
  submittedP = false;
  isLogged = false;
  product = {} as ProductModel;
  products: any;
  categories: any;
  category = {} as CategoryModel;

  constructor(
    private formBuilderProduct: FormBuilder,
    private formBuilderCategory: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private af: AngularFireDatabase,
    private afDb: AngularFireDatabase,
    private toastr: ToastrService
  ) {
    // Authentication
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log("Got to add-product. We are logged in");
        // Get products from database
        this.loadData();

        this.product.name = "";
        this.product.cost = 0;
        this.product.available = true;
        this.product.category = "";

        this.category.name = "";

        this.createForm();
      } else {
        this.isLogged = false;
        console.log("Got to add-product but wasn't logged in");
        this.router.navigate(["/login"]);
      }
    });
  }

  loadData() {
    this.afDb
      .list("/products", ref => ref.orderByChild("category"))
      .valueChanges()
      .subscribe(products => {
        this.products = products;
      });
    this.afDb
      .list("/categories", ref => ref.orderByChild("name"))
      .valueChanges()
      .subscribe(categories => {
        this.categories = categories;
      });
  }

  ngOnInit() {}

  createForm() {
    this.addProductForm = this.formBuilderProduct.group({
      name: ["", Validators.required],
      cost: ["", Validators.required],
      category: ["", Validators.required]
    });

    this.addCategoryForm = this.formBuilderCategory.group({
      name: ["", Validators.required]
    });
  }

  // Reference of addProductForm.controls
  get pf() {
    return this.addProductForm.controls;
  }

  // Reference of addCategoryForm.controls
  get cf() {
    return this.addCategoryForm.controls;
  }

  onSubmitProduct() {
    this.submittedP = true;
    if (this.addProductForm.invalid) {
      return;
    }

    this.product.name = this.pf["name"].value;
    this.product.cost = this.pf["cost"].value;
    this.product.category = this.pf["category"].value;

    const productsRef = this.af.list("/products");
    productsRef.push(this.product).then(ref => {
      this.product.k = ref.key;
      this.afDb
        .object(`products/${ref.key}`)
        .set(this.product)
        .then(() => {
          this.successMessage("La producto se agregó con éxito");
          this.submittedP = false;
          this.clearProductForm();
        })
        .catch(error => {
          this.errorMessage();
          console.log(error);
        });
    });
  }
  onSubmitCategory() {
    this.submittedC = true;
    if (this.addCategoryForm.invalid) {
      return;
    }

    this.category.name = this.cf["name"].value;

    const categoriesRef = this.af.list("/categories");
    categoriesRef.push(this.category).then(ref => {
      this.afDb
        .object(`categories/${ref.key}`)
        .set(this.category)
        .then(() => {
          // this.successMessage("La categoría se agregó con éxito");
          this.toastr.success(
            "Categoría añadida",
            "La categoría se agregó con éxito",
            {
              timeOut: 5000
            }
          );
          this.submittedC = false;
          this.clearCategoryForm();
        })
        .catch(error => {
          this.errorMessage();
          console.log(error);
        });
    });
  }

  onDeleteProduct(id: any) {
    const product = this.afDb.object(`/products/${id}`);
    product
      .remove()
      .then(() => {
        console.log("Eliminado con éxito");
        this.toastr.success("", "Producto eliminado con éxito", {
          timeOut: 5000
        });
      })
      .catch(error => {
        this.errorMessage();
        console.log(error);
      });
  }

  clearProductForm() {
    this.addProductForm.reset();
    this.pf["category"].setValue("");
  }

  clearCategoryForm() {
    this.addCategoryForm.reset();
  }

  errorMessage() {
    this.toastr.error(
      "Error inesperado",
      "Se ha producido un error, volver a intentarlo",
      {
        timeOut: 5000
      }
    );
  }

  successMessage(message: string) {
    this.toastr.success(
      "",
      message,
      {
        timeOut: 5000
      }
    );
  }
}
