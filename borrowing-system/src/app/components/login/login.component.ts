import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { UserModel } from "../../models/user.model";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private user = {} as UserModel;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.user.email = "";
    this.user.password = "";

    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        console.log("Got to login but was already logged in");
        this.router.navigate(["/home"]);
      }
    });
  }

  login() {
    this.authService
      .login(this.user)
      .then(res => {
        this.router.navigate(["/home"]);
      })
      .catch(error => {
        if (
          error.message.includes(
            "There is no user record corresponding to this identifier"
          )
        ) {
          console.log("Usuario inexistente.");
        } else if (error.message.includes("The password is invalid")) {
          console.log("Contraseña incorrecta.");
        } else if (
          error.message.includes(
            "A network error (such as timeout, interrupted connection or unreachable host) has occurred."
          )
        ) {
          console.log("No hay conexión a internet.");
        } else {
          console.log(
            "Ha ocurrido un error inesperado. Por favor intente nuevamente."
          );
        }
        console.log(error);
      });
  }

  logout() {}
  ngOnInit() {}
}
