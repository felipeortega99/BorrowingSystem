import { Injectable } from "@angular/core";

// Angular Fire
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import { User } from "firebase/app";

// //Firebase auth
// import { User } from "firebase/app";
import { UserModel } from "../models/user.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: User;

  constructor(private afAuth: AngularFireAuth) {
    afAuth.authState.subscribe((user: User) => {
      console.log("Email: " + this.email);
      this.user = user;
    });
  }
  get authenticated(): boolean {
    return this.user != null;
  }

  register(user: UserModel) {
    let { email, password } = user;
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then(user => resolve(user), err => reject(err));
    });
  }

  login(user: UserModel) {
    let { email, password } = user;
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
        user => {
          resolve(user);
        },
        err => reject(err)
      );
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  get email(): string {
    return this.user ? this.user.email: "";
  }
}
