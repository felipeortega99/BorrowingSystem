import { Component } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [AuthService]
})
export class AppComponent {
  title = "borrowing-system";
  isLogged = false;
  home = false;
  addProduct = false;
  fines = false;
  rentProducts = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        console.log("Hello " + this.authService.email);
        this.isLogged = true;
        console.log("Is user logged in? " + this.isLogged);
        this.changeActiveButton(this.router.url.substring(1));
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
    this.rentProducts = false;
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  goToHome() {
    this.changeActiveButton("home");
    this.router.navigate(["/home"]);
  }

  goToAddProduct() {
    this.changeActiveButton("add-product");
    this.router.navigate(["/add-product"]);
  }
  goToRentProducts() {
    this.changeActiveButton("rent-products");
    this.router.navigate(["/rent-products"]);
  }
  goToFines() {
    this.changeActiveButton("fines");
    this.router.navigate(["/fines"]);
  }

  changeActiveButton(name: string) {
    switch (name) {
      case "home":
        this.home = true;
        this.addProduct = false;
        this.rentProducts = false,
        this.fines = false;
        break;
      case "add-product":
        this.home = false;
        this.addProduct = true;
        this.rentProducts = false,
        this.fines = false;
        break;
      case "rent-products":
        this.home = false;
        this.addProduct = false;
        this.rentProducts = true,
        this.fines = false;
        break;
      case "fines":
        this.home = false;
        this.addProduct = false;
        this.rentProducts = false,
        this.fines = true;
        break;
      default:
        break;
    }
  }
}
