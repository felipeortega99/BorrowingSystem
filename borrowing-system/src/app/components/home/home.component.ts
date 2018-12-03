import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { LoanModel } from "../../models/loan.model";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  rentProductForm: FormGroup;
  submitted = false;
  isLogged = false;
  products: any;
  private loan = {} as LoanModel;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase ) {
    this.createForm();
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log("Got to home. We are logged in");
        afDb
          .list("/products")
          .valueChanges()
          .subscribe(products => {
            this.products = products;
          });
      } else {
        this.isLogged = false;
        console.log("Got to home but wasn't logged in");
        this.router.navigate(["/login"]);
      }
    });
  }

  ngOnInit() {}

  createForm() {
    this.rentProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      studentNumber: ['', Validators.required]
    });
  }
  get f() { return this.rentProductForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.rentProductForm.invalid) {
      return;
    }
  }
  }
