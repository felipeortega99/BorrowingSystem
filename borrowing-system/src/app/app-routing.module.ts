import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent, AddProductComponent } from './components/index.components';

const ROUTES: Routes = [
  {path: 'home', component: HomeComponent },
  {path: 'add-product', component: AddProductComponent },
  {path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
