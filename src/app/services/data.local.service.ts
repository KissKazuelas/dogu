import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Place, VisitPlace, InfoPlace, CheckRisk } from '../interfaces/interfaces';
import { Observable } from 'rxjs';
import { PlaceService } from './place.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  private _visitedPlaces : VisitPlace[] = [];
  public _actualPlace : InfoPlace  = null;
  private _storage: Storage;
  public _risk:  number = null;
  public _labelRisk : string = null;
  public options : any = null;

  constructor(private storage: Storage, 
    private http : HttpClient
    //private placeServices : PlaceService
    ) {
    //se inicia el servicio de localstorage 
    //para poder hacer operaciones
    this.init();
    //Se cargan los lugares visitados
    this.loadPlaces();
    //Se carga el place actual
    this.loadActualPlace();

  }

  get drawChart(){
    if(this._risk  && this._labelRisk ){
      this.createBarChart();
      return true;
    }
    return false;
  }
    async loadActualPlace(){

    const place : InfoPlace = await this.storage.get('isVisited');
    const fechaActual : Date = new Date();
    if(place){   
     this.getRisk(place.placeUid)
     .subscribe(res =>{
       this._risk = res.results.length * 30;
       console.log('EL RIESGO DEL LUGAR ES ', res);
       this._risk = this._risk > 100 ? 100 : this._risk;
       this._labelRisk = `${this._risk.toString()}%`
       console.log('se ha actualizado el label ', this._labelRisk, this._risk)
     });
      if(fechaActual > place.fecha){
        if( (fechaActual.getDate() > place.fecha.getDate()) || (fechaActual.getMonth() > place.fecha.getMonth())  || (fechaActual.getFullYear() > place.fecha.getFullYear())){
          console.log('se forzara la salida');  
          const fechaExit =  place.fecha;
            fechaExit.setHours( place.fecha.getHours() + ((24-place.fecha.getHours())/2))
            //const exit = await this.placeServices.leavePlace(place.visitId, fechaExit);
        }else{
          this._actualPlace = place;
        }
      }
    }else{
      this._actualPlace=null;
    }
  }

  cleanChart(){
    this._risk=null;
  }

  createBarChart() {
    
      this.options = {
        hasNeedle: true,
        outerNeedle: true,
        needleColor: "black",
        needleStartValue: this._risk,
        arcColors: ["rgb(61,204,91)","rgb(239,214,19)","rgb(255,84,84)"],
        arcDelimiters: [40,75],
        rangeLabel: ["0%","100%"],
      }
    
  }
  //Se cargarán desde localstorage los lugares visitados
  async loadPlaces(){

    const places = await this.storage.get('places');
    if(places){
      console.log('se obtuvieron lugares visiratos');
      this._visitedPlaces = places;
    }else{
      console.log('noooo se obtuvieron lugares visiratos');
    }
  }
  //Se inicia el servicio de localstorage
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;
  }
   //Funcion para obtener valor de localstorage
  async getValue(value : string){

    await this.init();

    if(this._storage){
      return await this._storage.get(value);
    }else{
      return false;
    
    }
  }
  //Funcion para guardar en localstorage
  async setValue(key : string, value: string | InfoPlace | boolean){

    if(this._storage){
      return await this._storage.set(key,value);
    }else{
      return false;
    }

  }

  get visitPlaces(){
    return [...this._visitedPlaces];
  }

  async deleteValue(key :string){
    return await this._storage.remove(key);
  }

  async addVisitPlace(place: Place){
    const fecha =  new Date();
    this._visitedPlaces.unshift({fecha, place});
    this.storage.set('places', this._visitedPlaces)
    .then(resp => console.log('Grabado'))
    .catch(erro=> { console.log('ERORRR al grabar')})
    .finally(console.log);
  }

  getRisk(locationUID : string): Observable <CheckRisk>{
    return this.http.post<CheckRisk>("http://dogu.ccbas.uaa.mx:443/report/riskbyplace",{locationUID});
  }

}
