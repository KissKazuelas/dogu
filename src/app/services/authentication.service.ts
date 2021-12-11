import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataLocalService } from './data.local.service';
import { AuthResponse, VerifyUserResponse } from '../interfaces/interfaces';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  
  token : string;
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private url : string = "http://dogu.ccbas.uaa.mx:443/";

  constructor(private dataLocal : DataLocalService,
    private http: HttpClient) { 
      this.loadToken();
    }
   
   
    async loadToken() {
      const jwt = await this.dataLocal.getValue('userToken');  
      if (jwt) {
        this.token = jwt;
        this.isAuthenticated.next(true);
      } else {
        this.isAuthenticated.next(false);
      }
    }
   

  login(date: Date){
    const birthDate = date.toString().split('T')[0];
     return this.http.post<AuthResponse>('http://dogu.ccbas.uaa.mx:443/user',{birthDate});
  }


}
