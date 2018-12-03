import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent implements OnInit {
addProductForm: FormGroup;
submitted = false;
isLogged = false;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private spinner: NgxSpinnerService) {
    this.createForm();
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
  }

  ngOnInit() {}

  createForm() {
    this.addProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      available: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  // Reference of addProductForm.controls
  get f() { return this.addProductForm.controls; }

  onSubmit(form:  NgForm) {
    this.spinner.show();

    this.submitted = true;
    if (this.addProductForm.invalid) {
      this.spinner.hide();
      return;
      // this.spinner.hide();
    }

  }
}
