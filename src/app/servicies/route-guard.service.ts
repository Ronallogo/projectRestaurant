import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { GlobalContants } from '../shared/global-constants';
import jwt_decode from 'jwt-decode';

// Utilisation de require pour charger jwt-decode
//const jwt_decode = require('jwt-decode');

@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  public userEmail   : string = "" ; 

  constructor(
    public auth: AuthService,
    public router: Router,
    private snackbarService: SnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let expectedRoleArray = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: any = localStorage.getItem('token');
    //const token: string | null = localStorage.getItem('token');

    if (!token) {
      console.log('Aucun token trouvé dans localStorage');
      this.router.navigate(['/']);
      return false;
    }

    console.log('Token trouvé :', token); // Affiche le token récupéré

    var tokenPayLoad: any;
    try {
      tokenPayLoad = jwt_decode(token); // Décodage du token JWT
      console.log('Payload du token décodé :', tokenPayLoad); 
      this.userEmail = tokenPayLoad.sub ; 
      console.log(this.userEmail) ;// Affiche le payload décodé
      console.log('Type de jwt_decode:', typeof jwt_decode); // Vérifie que c'est bien une fonction
    } catch (err) {
      console.error('Échec du décodage du token', err);
      localStorage.clear();
      this.router.navigate(['/']);
    }

    let expectedRole = ' ';

    for (let i = 0; i < expectedRoleArray.length; i++) {
      if (expectedRoleArray[i] == tokenPayLoad.role) {
        expectedRole = tokenPayLoad.role;
      }
    }

    if (tokenPayLoad.role == 'user' || tokenPayLoad.role == 'admin') {
      if (this.auth.isAuthenticated() && tokenPayLoad.role == expectedRole) {
        return true;
      }
      this.snackbarService.openSnackbar(
        GlobalContants.unauthorized,
        GlobalContants.error
      );
      this.router.navigate(['/cafe/dashboard']);
      return false;
    } else {
      this.router.navigate(['/']);
      localStorage.clear();
      return false;
    }

    /* const hasExpectedRole = expectedRoleArray.includes(tokenPayLoad.role);
    console.log(
      'Rôle attendu :',
      expectedRoleArray,
      'Rôle trouvé :',
      tokenPayLoad.role
    ); // Affiche les rôles

    if (!hasExpectedRole) {
      this.snackbarService.openSnackbar(
        GlobalContants.unauthorized,
        GlobalContants.error
      );
      this.router.navigate(['/']);
      return false;
    }

    if (this.auth.isAuthenticated()) {
      console.log('Utilisateur authentifié');
      return true;
    }

    this.snackbarService.openSnackbar(
      GlobalContants.unauthorized,
      GlobalContants.error
    );
    this.router.navigate(['/']);
    return false;*/
  }
}
