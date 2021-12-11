import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataLocalService } from '../services/data.local.service';


export const INTRO_KEY = 'intro-seen';
 

@Injectable({
  providedIn: 'root'
})
export class IntroGuard implements CanLoad {

  constructor(private router: Router, private dataLocal : DataLocalService){}

  
  async canLoad():  Promise <boolean> {
    
    const hasSeenIntro = await this.dataLocal.getValue(INTRO_KEY);

    console.log('hasseen',hasSeenIntro);

    if (hasSeenIntro && (hasSeenIntro === 'true')) {
      return true;
    } else {
      this.router.navigateByUrl('/intro', { replaceUrl:true });
      return false;
    }


  }

}
