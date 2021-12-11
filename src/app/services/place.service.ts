import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VerifyPlaceResponse, RegisterVisitResponse, CheckRisk } from '../interfaces/interfaces';
import { DataLocalService } from './data.local.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(
    private http: HttpClient,
    private dataLocalService : DataLocalService
  ) { }

  async verifyPlace(placeUUID: string){
    const jwt = await this.dataLocalService.getValue('userToken');
    return this.http.post<VerifyPlaceResponse>("http://dogu.ccbas.uaa.mx:443/places/veriffy",{placeUUID, jwt });
  }

  async registerVisit(lugarUID: string){
    const userJWT = await this.dataLocalService.getValue('userToken');
    
   return this.http.post<RegisterVisitResponse>("http://dogu.ccbas.uaa.mx:443/visit/create",{userJWT, entrada: this.construirFecha(new Date()), lugarUID });
  }

  async leavePlace(visitUID : string, exitTime : Date){
    return this.http.post("http://dogu.ccbas.uaa.mx:443/visit/exit",{visitUID, exitTime: this.construirFecha(exitTime) });
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
