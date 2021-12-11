import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataLocalService } from './data.local.service';
import { Observable } from 'rxjs';
import { VerifyUserResponse } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class ReporteService {


  
  userUID: string;

  constructor(private http: HttpClient, private dataLocal : DataLocalService){

    

  }



  registrarReporte(userJWT: string, fechaPrueba: Date, fechaSintomas : Date, detalles : string): Observable <VerifyUserResponse>{

     return this.http.post<VerifyUserResponse>("http://dogu.ccbas.uaa.mx:443/report/open",
            {
              userJWT, fechaPrueba : this.construirFecha(fechaPrueba), 
              fechaSintomas : this.construirFecha(fechaSintomas), 
              detalles
            });

  }

  construirFecha(fecha : Date) : string{
    const d = new Date;
    const entrada = [d.getFullYear(),
               d.getMonth()+1,
               d.getDate()].join('-')
               +' '+
              [d.getHours(),
               d.getMinutes(),
               d.getSeconds()].join(':');
    return entrada;
  }

}
