import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { DataLocalService } from '../services/data.local.service';
import { PlaceService } from '../services/place.service';
import { InfoPlace, Place } from '../interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  lugar : InfoPlace;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private alertController: AlertController,
    private placeService : PlaceService,
    private dataLocalService : DataLocalService,
    private toastController: ToastController,
    private router: Router) { }


  async scan() {
    this.barcodeScanner.scan().then( async barcodeData  =>  {
      console.log('Barcode data', barcodeData);
      //Se analisa el formato del código escaneado
      //Si es QR pasa, si no lanza alerta 
      if(barcodeData.format==='QR_CODE'){
        //Se verifica si es un lugar valido el escaneado
       const verificacion = await this.placeService.verifyPlace(barcodeData.text);
       
       verificacion
        .subscribe( async resp=>{
          //si es lugar valido resp.ok estará en true
          if(resp.ok===true){
           (await this.placeService.registerVisit(barcodeData.text))
           .subscribe(async respuestaVisita => {
            {
              await this.generarLugar( respuestaVisita.visitUID, barcodeData.text, resp.results )
              await this.dataLocalService.setValue('isVisited',this.lugar);
              await this.dataLocalService.addVisitPlace(resp.results);
              await this.dataLocalService.loadActualPlace();
              await this.presentEror('Lugar guardado','success');
              await this.router.navigateByUrl('/tabs', { replaceUrl:true });       
            }
           })
          }
        },
        //si no, lugar no es valido
        async err =>{          
           await this.presentEror('Código no valido','danger');
           await this.router.navigateByUrl('/tabs/tab1', { replaceUrl:true });
        }
        )
      }else{
        if(barcodeData.cancelled===true){
          this.router.navigateByUrl('/tabs', { replaceUrl:true });
        }else{
          await this.presentEror('Formato de código incorrecto','danger');
          this.router.navigateByUrl('/tabs', { replaceUrl:true });
        }
      }
      
    }).catch(err => {
      console.log('Error', err);
    });    
  }

  async generarLugar(visitId : string, placeUid: string, info : Place){
    this.lugar = { visitId,  placeUid,  info, fecha: new Date() };
  }

  ionViewWillEnter() {
    this.scan();
  }

  async presentEror(message: string, color: string) {
    
      const toast = await this.toastController.create({
        message,
        duration: 4000,
        color
      });
      toast.present();

  }

  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Codigo escaneado',
      subHeader: 'Contenido:',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
