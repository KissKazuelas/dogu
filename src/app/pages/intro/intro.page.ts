import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { DataLocalService } from '../../services/data.local.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {


  @ViewChild(IonSlides)slides: IonSlides;


  constructor(private router: Router, private localData: DataLocalService) { }

  ngOnInit(): void {
  }


 
  next() {
    this.slides.slideNext();
  }
 
  


  async onClick(){


    
    const resp = await this.localData.setValue('intro-seen', 'true');
    this.router.navigateByUrl('/login', { replaceUrl:true });
 

  }

}
