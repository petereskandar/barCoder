import { Component } from '@angular/core';

import { NavController, NavParams, Platform, LoadingController, ToastController } from 'ionic-angular';
import {SQLite} from "ionic-native";
import {ScannerApi} from "../../shared/scanner-api.service";
import {barcodeResult} from "../../models/barcodeResult";
import * as _ from 'lodash';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html',
})
export class Page2 {

  public database: SQLite;
  public productList: barcodeResult[] = [] ;
  public bkpProductList: barcodeResult[] = [] ;
  queryText: string= '';
  searching: any = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private dbService: ScannerApi,
              private loadingController : LoadingController,
              private toastCtrl : ToastController) {

  }

  ionViewWillEnter(){
    this.searching = false;
    this.load();
  }

  public load() {

    let loader = this.loadingController.create({
      content: 'Getting Data....',
      spinner : 'dots'
    });
    loader.present().then(()=> {
      this.dbService.getProductList().then((result) => {
        this.productList = [];
        if (result > 0) {
          for (var i = 0; i < result; i++) {
            let item = result[i];
            this.productList.push(new barcodeResult(item.barCode, item.format, item.description, item.price, item.category));
            this.bkpProductList = this.productList;
          }
        }
        loader.dismiss();
        this.showToast('List Loaded correctly', 2000);

      }, (error) => {
        this.showToast(error, 2000);
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

  deleteProduct(event, product : barcodeResult, i:number){

    this.dbService.deleteProduct(product).then((results) =>{
      this.productList.splice(i,1);
      //this.bkpProductList = this.productList;
      this.showToast(product.barCode + '- deleted Successfully', 2000);
      this.load();
    }, (error)=> {
      this.showToast('Error deleteing : ' + product.barCode , 2000);
    });
  }

  public delete() {
   this.dbService.delete().then((results) =>{
     this.productList = null;
     console.log('table deleted successfully');
   }, (error) => {
     console.log('error deleting table')
   });

  }

  public getProductDetails(event, product: barcodeResult){
    alert(JSON.stringify(product));
  }

  updateProducts(){
    let queryTextLower = this.queryText.toLowerCase();
    let filteredProducts: barcodeResult[] = [];
    filteredProducts = _.filter(this.bkpProductList, pl => pl.description.toLowerCase().includes(queryTextLower));

    this.productList = filteredProducts;
    //this.searching = false;
  }

  stopSpinner(){
    this.searching = false;
  }

  startSpinner(){
    this.searching = true;
  }

  getHeader(record, recordIndex, records){
    if(recordIndex  === 0 || record.category !== records[recordIndex-1].category){
      return record.category;
    }else
      return null;
  }

  public showToast(message: string, duration: number){

    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position : 'bottom'
    });
    toast.present();
  }

}
