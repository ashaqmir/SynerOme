import { Injectable } from '@angular/core';
import { IProfile } from '../../models/profile';

@Injectable()
export class AppStateServiceProvider {

  public loginStateSet: boolean = false;
  public userProfile: IProfile ;

  constructor() {}

}
