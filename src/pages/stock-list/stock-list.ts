import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, AlertController, ToastController, MenuController } from 'ionic-angular';
import { InputStockPage } from '../input-stock/input-stock';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { StockItem } from '../../models/stock-item/stock-item.interface';

import { AngularFireAuth } from 'angularfire2/auth';
import { EditStockPage } from '../edit-stock/edit-stock';



/**
 * Generated class for the StockListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-stock-list',
  templateUrl: 'stock-list.html',
})
export class StockListPage {
  
  
  //pertama: any;
  //kedua: any;
  stockListRef: FirebaseListObservable<StockItem[]>;
  //queryText: string;
  //filteredItems: Array<StockItem>;
  stockItem = {} as StockItem;
 
 
 // Items: string[];
  //errorMessage: string;

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, private toast: ToastController, public alertCtrl: AlertController, private database: AngularFireDatabase, private actionSheetCtrl: ActionSheetController, public navCtrl: NavController, public navParams: NavParams) {
    
   
  
    //this.pertama=1;
    this.afAuth.authState.subscribe(auth => {
      
        this.stockListRef = this.database.list(`stock-list/${auth.uid}`);
       
        
    });
    
    
    
    this.menuCtrl.enable (false, 'myMenu');

    
  }
  
 
//ionViewDidLeave() {

  //  this.menuCtrl.enable (true, 'myMenu');
    //this.menuCtrl.swipeEnable( true );
//}
ionViewWillUnload() {
  this.menuCtrl.swipeEnable( true );
  this.menuCtrl.enable (true, 'myMenu');
}
  ionViewDidLoad() {
  

    this.menuCtrl.enable (false, 'myMenu');
    this.menuCtrl.swipeEnable( false );
    console.log('ionViewDidLoad StockListPage');
  }
 
 /* search(event) {
   console.log(event.target.value);
   var val = event.target.value;

   this.stockListRef.subscribe((_stockListRef) => {
      this.filteredItems = [];
      _stockListRef.forEach(item => {
        if (item.namaBrg.toLowerCase().indexOf(val.toLowerCase()) > -1) {
          this.filteredItems.push(item);
        }
      })
   });
}
  
 updateItems(){
  this.pertama = 0;
  this.kedua=1; 
  let queryTextLower = this.queryText.toLowerCase();
  
  this.stockListRef.subscribe((_stockListRef) => {
   this.filteredItems = [];
    _stockListRef.forEach(td => {
      
    
      if (td.namaBrg.toLowerCase().includes(queryTextLower))  {
        this.filteredItems.push(td);
             
      }
    })
    
  });
  
    
  
 } */
 
  selectStockItem(stockItem: StockItem) {
    this.actionSheetCtrl.create({
      title: `${stockItem.namaBrg}`,
      buttons: [
      {
        text: 'Ubah',
        handler: () => {
          
          this.navCtrl.push(EditStockPage, 
            { stockItemId: stockItem.$key});
         
        }
      },
      {
        text: 'Hapus',
        role: 'destructive',
        handler: () => {
          
            let confirm = this.alertCtrl.create({
              title: 'Hapus Data',
              message: 'Anda Yakin Ingin Menghapus?',
              buttons: [
                {
                  text: 'Tidak',
                  handler: () => {
                    console.log('Disagree clicked');
                  }
                },
                {
                  text: 'Iya',
                  handler: () => {
                    console.log('Agree clicked');
                    this.toast.create({
                      message: `Data telah dihapus`,
                      duration : 1000
                      }).present();
                    this.stockListRef.remove(stockItem.$key);
                  }
                }
              ]
            });
            confirm.present();
          
        }
      },
      {
        text: 'Batal',
        role: 'cancel',
        handler: () => {
          console.log("User Cancel");
        }
      }
    ]
    }).present();
  }

  tambahStock() {
    
    this.navCtrl.push(InputStockPage);
  }

 
}
