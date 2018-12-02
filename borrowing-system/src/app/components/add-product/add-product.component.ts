import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"]
})
export class AddProductComponent implements OnInit {
  
  isLogged: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
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
}
