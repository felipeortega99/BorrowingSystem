import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoanModel } from '../../models/loan.model';

@Component({
  selector: 'app-rent-products',
  templateUrl: './rent-products.component.html',
  styleUrls: ['./rent-products.component.scss']
})
export class RentProductsComponent implements OnInit {
  submitted = false;
  isLogged = false;
  products: any;
  private loan = {} as LoanModel;

  constructor(private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log('Got to home. We are logged in');
        afDb.list('/products').valueChanges().subscribe(products => {
          this.products = products;
        });
      } else {
        this.isLogged = false;
        console.log('Got to home but wasn\'t logged in');
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnInit() {}

  onDelivered(id) {

  }

  onLate(id) {
  }

  onNotDelivered(id) {
  }
}
