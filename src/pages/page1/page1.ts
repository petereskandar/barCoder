import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {barcodeResult} from "../../models/barcodeResult";
import {ScannerApi} from "../../shared/scanner-api.service";

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  scanResult :barcodeResult;
  constructor(public navCtrl: NavController, private dbService : ScannerApi) {}

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      if(!barcodeData.cancelled){
        this.scanResult = new barcodeResult(barcodeData.text, barcodeData.format);

        //searching if barcode exist
        this.dbService.searchProduct(this.scanResult).then((result)=> {
          if(result)
            //this.scanResult = result;
          console.log('test');
        }, (error)=>{

        });
      }
    },(err) => {
      //an error occured
      alert('Error scanning code');
    })
  }

  insertProduct(){
    alert(this.scanResult.barCode);
    this.dbService.insertProduct(this.scanResult);
    this.scanResult = null;
  }

  reset(){
    this.scanResult = null;
  }
}
