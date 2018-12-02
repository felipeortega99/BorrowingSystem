import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [AuthService]
})
export class AppComponent {
  title = "borrowing-system";
  isLogged: boolean = false;
  home: boolean = false;
  addProduct: boolean = false;
  fines: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        console.log("Hello " + this.authService.email);
        this.isLogged = true;
        console.log("Is user logged in? " + this.isLogged);
        this.home = true;
        this.addProduct = false;
        this.fines = false;
      } else {
        this.isLogged = false;
        console.log("Is user logged in? " + this.isLogged);
      }
    });
  }

  logout() {
    this.isLogged = false;
    this.home = false;
    this.addProduct = false;
    this.fines = false;
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  goToHome() {
    this.home = true;
    this.addProduct = false;
    this.fines = false;
    this.router.navigate(["/home"]);
  }

  goToAddProduct() {
    this.home = false;
    this.addProduct = true;
    this.fines = false;
    this.router.navigate(["/add-product"]);
  }

  goToFines() {
    this.home = false;
    this.addProduct = false;
    this.fines = true;
    this.router.navigate(["/fines"]);
  }
}
