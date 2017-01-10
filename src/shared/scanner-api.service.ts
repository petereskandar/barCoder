/**
 * Created by eskandar.peter on 13/12/2016.
 */
import {Injectable} from '@angular/core';
import {Platform, LoadingController} from 'ionic-angular';
import {SQLite} from 'ionic-native';
import {barcodeResult} from "../models/barcodeResult";


@Injectable()
export class ScannerApi {

  private storage: SQLite;
  private isOpen: boolean;
  productList: barcodeResult[];

  constructor(private platform : Platform, private loadingController : LoadingController){
    this.platform.ready().then(() => {
        if (!this.isOpen) {
          this.storage = new SQLite();
          this.storage.openDatabase({name: "data.db", location: "default"}).then(() => {
            this.storage.executeSql("CREATE TABLE IF NOT EXISTS productList (id INTEGER PRIMARY KEY AUTOINCREMENT, barCode TEXT, format TEXT, description TEXT, price NUMBER, category TEXT )", []);
            this.isOpen = true;
          });
        }
    });
  }

  public getProductList() {

      return new Promise((resolve, reject) => {
        this.storage.executeSql("SELECT * FROM productList", []).then((data) => {
          let productList = [];
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) {
              /*productList.push({
               id: data.rows.item(i).id,
               firstname: data.rows.item(i).firstname,
               lastname: data.rows.item(i).lastname
               });*/
              productList[i] = new barcodeResult(data.rows.item(i).barCode, data.rows.item(i).format, data.rows.item(i).description, data.rows.item(i).price, data.rows.item(i).category);
            }
          }
          resolve(productList);
        }, (error) => {
          reject(error);
        });
      });
  }

  /*public getProductList() {
    return this.storage.executeSql("SELECT * FROM productList", []);
  }*/

  public insertProduct(product : barcodeResult) {
    return new Promise((resolve, reject) => {
      this.storage.executeSql("INSERT INTO productList (barCode, format, price, description, category) VALUES (?, ?, ?, ? , ?)", [product.barCode, product.format, product.price, product.description, product.category]).then((data) => {
        alert('success' + data);
        resolve(data);
      }, (error) => {
        alert('error' + error);
        reject(error);
      });
    });
  }



   delete() {
     return new Promise((resolve, reject) => {
       this.storage.executeSql("delete FROM productList", []).then((data) => {
         resolve(data);
       }, (error) => {
         reject(error);
       });
     });

  }



}
