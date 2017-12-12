import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product : any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams) {
       this.product= this.navParams.get('selectedProduct');
       console.log(this.product);
  }

  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(){
    console.log('Add to cart.');
    this.navCtrl.push(CartPage, {selectedProduct: this.product});
  }

}
