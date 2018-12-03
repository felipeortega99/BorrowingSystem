import { NgModule, Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {
  HomeComponent,
  FinesComponent,
  LoginComponent,
  AddProductComponent,
  RentProductsComponent
} from "./components/index.components";

const ROUTES: Routes = [
  { path: "home", component: HomeComponent },
  { path: "fines", component: FinesComponent },
  { path: "login", component: LoginComponent },
  { path: "add-product", component: AddProductComponent },
  { path: "rent-products", component: RentProductsComponent },
  { path: "", redirectTo: "login", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
