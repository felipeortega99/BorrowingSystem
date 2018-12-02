import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  isLogged: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log("Got to home. We are logged in");
      } else {
        this.isLogged = false;
        console.log("Got to home but wasn't logged in");
        this.router.navigate(["/login"]);
      }
    });
  }

  ngOnInit() {}
}
