import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { LoanModel } from '../../models/loan.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rent-products',
  templateUrl: './rent-products.component.html',
  styleUrls: ['./rent-products.component.scss']
})
export class RentProductsComponent implements OnInit {
  submitted = false;
  isLogged = false;
  loans: any[];
  private loan = {} as LoanModel;

  constructor(private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private toastr: ToastrService) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log('Got to home. We are logged in');
        this.loadData();
      } else {
        this.isLogged = false;
        console.log('Got to home but wasn\'t logged in');
        this.router.navigate(['/login']);
      }
    });
  }

  loadData() {
    this.afDb
      .list("/loans", ref => ref.orderByChild("status").equalTo('loaned'))
      .valueChanges()
      .subscribe(loans => {
        this.loans = loans;
        console.log(this.loans);
      });
  }
  ngOnInit() {}

  onDelivered(id) {
    // tslint:disable-next-line:triple-equals
    const loan = this.loans.find(l => l.k == id);
    const product = loan.item;
    product.available = true;
    loan.status = 'delivered';
    this.updateProduct(product);
    this.updateLoan(loan);
  }

  onLate(id) {
    // tslint:disable-next-line:triple-equals
    const loan = this.loans.find(l => l.k == id);
    const product = loan.item;
    product.available = true;
    loan.status = 'Entregado tarde';
    this.updateProduct(product);
    this.updateLoan(loan);

    const productsRef = this.afDb.list('/fines');
      productsRef.push(loan).then(ref => {
        loan.k = ref.key;
        this.afDb.object(`fines/${ref.key}`).set(loan).then(() => {
          console.log('fines added');
        }).catch(error => {
          // this.errorMessage();
          console.log(error);
        });
      });
  }

  onNotDelivered(id) {
    // tslint:disable-next-line:triple-equals
    const loan = this.loans.find(l => l.k == id);
    const product = loan.item;
    product.available = false;
    loan.status = 'No entregado';
    this.updateProduct(product);
    this.updateLoan(loan);

    const productsRef = this.afDb.list('/fines');
      productsRef.push(loan).then(ref => {
        loan.k = ref.key;
        this.afDb.object(`fines/${ref.key}`).set(loan).then(() => {
          console.log('fines added');
        }).catch(error => {
          // this.errorMessage();
          console.log(error);
        });
      });
  }

  updateProduct(product: any) {
    this.afDb.object(`/products/${product.k}`)
    .update({ available: product.available , category: product.category, cost: product.cost, k: product.k, name: product.name});
  }

  updateLoan(loan: any) {
    this.afDb.object(`/loans/${loan.k}`)
    .update({ k: loan.k, borrower_name: loan.borrower_name, 
      borrower_id: loan.borrower_id, start: loan.start, 
      end: loan.end, status: loan.status});
      this.successMessage('Acción realizada exitosamente');
  }

  successMessage(message: string) {
    this.toastr.success('', message, {
      timeOut: 5000
    });
  }
}
