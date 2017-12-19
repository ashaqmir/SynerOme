import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { IProfile } from '../../models/models';


@Injectable()
export class StorageHelperProvider {

  constructor(public http: Http,
    private storage: Storage) {
  }


  setProfile(uid: string, profile: IProfile): Promise<any> {
    return this.storage.set(uid, profile).then((value) => {
      return value;
    });
  }

  getStep(): Promise<string> {
    return this.storage.get('profStep').then((value) => {
      return value;
    });
  }

  getProfile(uid: string): Promise<IProfile> {
    return this.storage.get(uid).then((value) => {
      return value;
    });
  }

  clearStorage(){
    this.storage.clear();
  }
}
