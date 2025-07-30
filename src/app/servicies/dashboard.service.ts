import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiUrl; // URL de ton backend

  constructor(private httpClient: HttpClient) { }

  getDetails(): Observable<any> {  
    const token = localStorage.getItem('token'); // Récupère le token JWT du localStorage

    if (token) {
      // Crée les en-têtes HTTP avec le token JWT
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Envoie la requête GET à l'URL de ton API avec les en-têtes appropriés
      return this.httpClient.get(this.url + "/dashboard/details", { headers });
    } else {
      console.error('Aucun token trouvé dans le localStorage');
      return new Observable(observer => {
        observer.error('Token non disponible');
      });
    }
  }
}
