import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AngularFireDatabase } from 'angularfire2/database';
import { ProductDetailsPage } from '../pages';


@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {

  products: any[] = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private afDB: AngularFireDatabase) {
  }

  ngOnInit() {
    
    let loadingPopup = this.loadingCtrl.create({
      spinner: 'crescent',
      content: ''
    });
    loadingPopup.present();

    this.afDB.list('/products', ref => ref.orderByChild('id')).valueChanges()
      .subscribe(items => {
        this.products = items;
        //console.log(this.products);
        loadingPopup.dismiss();
        this.products.forEach(product => {
          console.log(product.name);
        })
      });
  }
 
  productDetails(product) {
    console.log(product);
    this.navCtrl.push(ProductDetailsPage, {selectedProduct: product});
  }

}
