import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";

@Component({
  selector: "app-fines",
  templateUrl: "./fines.component.html",
  styleUrls: ["./fines.component.scss"]
})
export class FinesComponent implements OnInit {
  isLogged = false;
  fines: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth) {
        this.isLogged = true;
        console.log("Got to fines. We are logged in");
        afDb
          .list("/fines", ref => ref.orderByChild("borrower_id"))
          .valueChanges()
          .subscribe(fines => {
            this.fines = fines;
          });
      } else {
        this.isLogged = false;
        console.log("Got to fines but wasn't logged in");
        this.router.navigate(["/login"]);
      }
    });
  }

  ngOnInit() {}
}
