import { Component } from '@angular/core';

import { NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import {SQLite} from "ionic-native";
import {ScannerApi} from "../../shared/scanner-api.service";
import {barcodeResult} from "../../models/barcodeResult";

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {

  public database: SQLite;
  public productList: barcodeResult[] = [] ;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbService: ScannerApi,
              private loadingController : LoadingController) {

  }

  ionViewWillEnter(){
    this.load();
  }

  public load() {

    let selectedTourney = this.navParams.data;

    let loader = this.loadingController.create({
      content: 'Getting Data....'
    });

    loader.present().then(()=> {
      this.dbService.getProductList().then((result) => {
        this.productList = [];
        if (result.length > 0) {
          for (var i = 0; i < result.length; i++) {
            let item = result[i];
            this.productList.push(new barcodeResult(item.barCode, item.format, item.description, item.price, item.category));
          }
        }

        loader.dismiss();

      }, (error) => {
        alert('list error');
        console.log("ERROR: ", error);
      });
    });
  }

  /*public add(firstName:string, lastName:string) {
    this.dbService.(firstName, lastName).then((result)=>{
      this.load();
    }, (error) => {
      console.log('Error Inserting new person');
    });
  }*/


  public delete() {
   this.dbService.delete().then((results) =>{
     this.productList = null;
     console.log('table deleted successfully');
   }, (error) => {
     console.log('error deleting table')
   });

  }

}
