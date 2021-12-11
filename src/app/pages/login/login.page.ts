import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { validarFecha } from './validiatos.login';
import { ModalLoginInfoComponent } from '../../components/modal-login-info/modal-login-info.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { DataLocalService } from '../../services/data.local.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
  name: string = 'example@mail.com'
 
  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController,
    private authService : AuthenticationService,
    private dataLocalService: DataLocalService
  ) {}
 
  ngOnInit() {
    this.credentials = this.fb.group({
      date: ['2021-09-14T19:29:26.524-05:00', [Validators.required, this.validatePassword]],
    });

    this.credentials.get('date').valueChanges.subscribe(resp=>{
      this.change();
    })
  }

 
 
    async login() {
      const loading = await this.loadingController.create();
      await loading.present();
      
      this.authService.login(this.credentials.get('date').value).subscribe(
        async (res) => {
          await this.dataLocalService.setValue('userToken',res.jwt);
          await loading.dismiss();   
          await this.authService.loadToken();
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        },
        async (res) => {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Login failed',
            message: res.error.error,
            buttons: ['OK'],
          });
          await alert.present();
        }
      );
    }
 
  change(){
    if(this.credentials.get('date').errors){
      this.presentEror(this.credentials.get('date').errors?.msg);
    }
  }

  async presentEror(error: string) {
    if(this.credentials.get('date')){
      const toast = await this.toastController.create({
        message: error,
        duration: 1000,
        color: 'danger'
      });
      toast.present();
    }
  }
 

  private validatePassword(control: AbstractControl) {

    let error = null;

    const fecha  = new Date(control.value);
    const fechaAux  = new Date();
    const fechaMin = fechaAux;
    fechaMin.setFullYear(fechaMin.getFullYear()-17);

    if (fechaMin < fecha) {
      error = { ...error, msg: 'Edad no admitida' };
    }
  
    return error;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalLoginInfoComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}


