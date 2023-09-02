// Code by https://github.com/interaminense
import { FirebaseApp } from "firebase/app";
import {
  Auth as FirebaseAuth,
  browserLocalPersistence,
  setPersistence,
  signOut as _signOut,
  signInWithPopup,
  User,
} from "firebase/auth";

import { MESSAGES, PREFIX } from "./constants";
import { DEV_MODE } from "./constants";
import app, { auth } from "./config";

import { GoogleAuthProvider } from "firebase/auth";

export class Auth {
  app: FirebaseApp;
  auth: FirebaseAuth;
  provider: GoogleAuthProvider;

  constructor() {
    this.app = app;
    this.auth = auth;
    this.provider = new GoogleAuthProvider();
  }

  get isKnownUser(): boolean {
    return !!this.auth.currentUser && !this.auth.currentUser.isAnonymous;
  }

  get getCurrentUser() {
    return this.auth.currentUser;
  }

  async signIn(callback: (user: User) => void) {
    await setPersistence(this.auth, browserLocalPersistence);

    try {
      if (!this.auth.currentUser) {
        const user = await signInWithPopup(this.auth, this.provider);

        this._log(MESSAGES.USER_IS_AUTH);

        callback(user.user)
      }
      else {
        callback(this.auth.currentUser)
      }
    } catch (error) {
      this._log(MESSAGES.USER_IS_NOT_AUTH);
    }
  }

  async signOut() {
    try {
      await _signOut(this.auth);

      window.location.href = "/"

      this._log(MESSAGES.USER_IS_NOT_AUTH);
    } catch (error) {
      this._log(MESSAGES.USER_IS_NOT_AUTH_FAIL);
    }
  }

  private _log(...params: any) {
    if (!DEV_MODE) {
      return;
    }

    console.log(PREFIX("Auth"), ...params);
  }
}
