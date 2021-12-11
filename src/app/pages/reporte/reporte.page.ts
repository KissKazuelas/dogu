import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ReporteService } from '../../services/reporte.service';
import { DataLocalService } from '../../services/data.local.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {


  reporte : FormGroup;
  fechaActual : Date  ;


  constructor(private fb : FormBuilder,
              private toastController: ToastController,
              private reporteService: ReporteService,
              private dataLocal : DataLocalService,
              private router: Router) { 
    this.fechaActual = new Date();
  }

  ngOnInit() {

    this.reporte = this.fb.group({
      fechaSintomas: ['2021-09-14T19:29:26.524-05:00', [Validators.required, this.validateFecha]],
      fechaPrueba: ['2021-09-14T19:29:26.524-05:00', [Validators.required, this.validateFecha]],
      detalles: ['Sin detalles']
    })

  }

  change(event: any){
    if(this.reporte.invalid){
      this.presentEror('Datos no permitidos', 'danger');
    }
  }

  ionViewWillEnter(){
    this.resetForm();
  }

  resetForm(){
    this.reporte.reset({
      fechaSintomas: '2021-09-14T19:29:26.524-05:00',
      fechaPrueba: '2021-09-14T19:29:26.524-05:00',
      detalles: 'Sin detalles'
    })
  }



  async presentEror(error: string, type: string) {
    
      const toast = await this.toastController.create({
        message: error,
        duration: 1000,
        color: type
      });
      toast.present();
    
  }


  private validateFecha(control: AbstractControl) {

    let error = null;

    const fecha  = new Date(control.value);
    const fechaAux  = new Date();

    if (fecha > fechaAux) {
      error = { ...error, msg: 'Fecha no admitida' };
    }
  
    return error;
  }

  async reportarContagio(){
    //success
    if(this.reporte.invalid){
      await this.presentEror('Datos invalidos', 'danger');
    }else{
      const jwt = await this.dataLocal.getValue('userToken');
      await this.reporteService.registrarReporte(jwt, this.reporte.get('fechaSintomas').value, this.reporte.get('fechaPrueba').value, this.reporte.get('detalles').value)
      .subscribe(async res =>{
        if(res.ok){
          await this.presentEror(res.msg, 'success');
          this.router.navigateByUrl('/tabs');
        }
      }) 
    }
  }


}
