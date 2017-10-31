import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class AppStateServiceProvider {

  public loginStateSet: boolean = false;
  public userProfile: IProfile;
  
  constructor() {
    
  }
  
}
