import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoPlace } from '../../interfaces/interfaces';
import { DataLocalService } from '../../services/data.local.service';
import { AlertController, ToastController } from '@ionic/angular';
import { PlaceService } from '../../services/place.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {


  lugar : string = 'Actualmente no te encuentras dentro de la Universidad.';
  //OPTS FOR GAUGE CHART
  public canvasWidth = 300
  public needleValue = 65
  public centralLabel = '65%'
  public options : any;

  colorArray: any;
   constructor(public dataLocalService: DataLocalService,
               private toastController: ToastController,
               public alertController: AlertController,
               private placeService: PlaceService,
               private router : Router ) {
  
   }

  async obtenerLugar(){
   
    const lugar = await this.dataLocalService.getValue('isVisited');
    if(lugar){
     this.lugar = `Lugar: ${lugar.info.descripcion} Centro: ${lugar.info.centro}`;
     
     
    }else{
      console.log('no alcanzo a cargarse');
      
    }

  }

  ionViewWillLeave(){
    this.lugar = 'Actualmente no te encuentras dentro de la Universidad.';
  }

  ngOnInit(): void {
    
    this.obtenerLugar();
 
  }

  ionViewWillEnter() {
    this.obtenerLugar();
    this.ngOnInit();
    this.dataLocalService.drawChart;

  }

  ionViewDidEnter(){
      
      console.log(this.lugar,'did enter',this.dataLocalService._actualPlace);
      
  }

  setValor(){
    this.lugar= 'Actualmente no te encuentras dentro de la Universidad.';
  }
  
  
 

  async salir() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: 'Confirme que ha <strong>salido</strong del lugar',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            
          }
        }, {
          text: 'Confirmar',
           handler: () => {
             this.placeService.leavePlace(this.dataLocalService._actualPlace.visitId, new Date())
             .then( async resp=>{
               await resp.subscribe(async exitResp=>{
                 console.log(exitResp);
                 await this.dataLocalService.deleteValue('isVisited');
                 await this.dataLocalService.loadActualPlace();
                 this.setValor();
                 this.dataLocalService.cleanChart();
                 await this.presentEror('Ha salido con exito','success');
                 this.router.navigateByUrl('/tabs');
               })
             })
             .catch( async err =>{
              await this.presentEror('Ha sucedido un error','danger');
             })
             
          }
        }
      ]
    });

    await alert.present();
  }

  async presentEror(message: string, color: string) {
    
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      color
    });
    toast.present();

}
  async reportarContagio(){
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirmar!',
        message: '¿Esta seguro que desea <strong>reportar</strong> un contagio?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              
            }
          }, {
            text: 'Confirmar',
             handler: () => {
               
              this.router.navigateByUrl('/reporte');
               
            }
          }
        ]
      });
  
      await alert.present();
  }

}
