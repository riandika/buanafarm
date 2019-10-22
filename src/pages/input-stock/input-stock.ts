import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { StockItem } from '../../models/stock-item/stock-item.interface';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated'
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';


@Component({
  selector: 'page-input-stock',
  templateUrl: 'input-stock.html',
})
export class InputStockPage {

  jumlahBrg: number = 0;
 
  stockItem = {} as StockItem;
  stockItemRef$: FirebaseListObservable<StockItem[]>
  
  //queryText: string;
  filteredItems: Array<StockItem>;
  //arrData = []
  //namaBrg
  //ket
  jikasama: number = 0;
  nmbrg1;
  nmbrg2;
  stn1;
  stn2;
  public isToggled: boolean;
  public isToggled2: boolean;
 //queryText;
  constructor(public menuCtrl: MenuController, private database: AngularFireDatabase, private toast: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    //this.currentdate= new Date();
    
    this.isToggled = false;
    this.isToggled2 = false;
    this.stockItem.status = 0;
    this.stockItem.status2 = 0;
    this.nmbrg1 = 1;
    this.stn1 = 1;
    this.menuCtrl.enable (false, 'myMenu');
    this.menuCtrl.swipeEnable( false );
    //this.afDatabase.list("/stock/").subscribe(_data => {
      //this.arrData = _data

      //console.log(this.arrData);

    //})
     this.afAuth.authState.subscribe(auth => {
     this.stockItemRef$ = this.database.list(`stock-list/${auth.uid}`);
     //this.stockItem.currentdate = this.currentdatetime;
     
    });
    
    
  }
  
  
   /*onSelectChange($event){
    
      this.jikasama = 0;
      let queryTextLower = this.stockItem.namaBrg.toLowerCase();
      
      this.stockItemRef$.subscribe((_stockListRef) => {
       this.filteredItems = [];
        _stockListRef.forEach(td => {
          
        
          if (td.namaBrg.toLowerCase().includes(queryTextLower))  {
            
            this.filteredItems.push(td);
            
            this.jikasama = 1;
            
              
             
          }
          
        })
        
      });
    
    
      if(this.jikasama==1) {
        this.toast.create({
                
          message: `Maaf Stok masih ada`,
          duration : 2000
          }).present();
      }
    
      
   }*/
 
   public notify() {
    if (this.isToggled==false){
      this.nmbrg1=1;
      this.nmbrg2=0;
      this.stockItem.status = 0;
    } 
    else{
      this.nmbrg1=0;
      this.nmbrg2=1;
      this.stockItem.namaBrg="";
      this.stockItem.status = 1;
    }
  }
  public notify2() {
    if (this.isToggled2==false){
      this.stn1=1;
      this.stn2=0;
      this.stockItem.status2 = 0;
    } 
    else{
      this.stn1=0;
      this.stn2=1;
      this.stockItem.satuan="";
      this.stockItem.status2 = 1;
    }
  }
  
  simpanStockItem(stockItem: StockItem) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
  
      setTimeout(() => {
        
        if (this.stockItem.namaBrg == null || this.stockItem.satuan == null || this.stockItem.jumlahBrg == null)
        {
          
          loading.dismiss();
          this.toast.create({
            message: 'Harap Di Isi',
            duration : 3000
            }).present(); 
            
        }
        
        else {
          this.stockItem.tanggal = moment().format();
          if (this.stockItem.note == null) {
            
            this.stockItemRef$.push({
              tanggal: this.stockItem.tanggal,
              namaBrg: this.stockItem.namaBrg,
              status: this.stockItem.status,
              status2: this.stockItem.status2,
              jumlahBrg: Number(this.stockItem.jumlahBrg),
              satuan: this.stockItem.satuan
              //note : this.stockItem.note
              
            });
            loading.dismiss();
            this.toast.create({
            message: `Berhasil Menyimpan`,
            duration : 3000
            }).present();
            this.stockItem = {} as StockItem;
            this.navCtrl.pop();

          }
          else {
            this.stockItemRef$.push({
          
              namaBrg: this.stockItem.namaBrg,
              tanggal: this.stockItem.tanggal,
              jumlahBrg: Number(this.stockItem.jumlahBrg),
              status: this.stockItem.status,
              status2: this.stockItem.status2,
              satuan: this.stockItem.satuan,
              note : this.stockItem.note
              
            });
            loading.dismiss();
            this.toast.create({
            message: `Berhasil Menyimpan`,
            duration : 3000
            }).present();
            this.stockItem = {} as StockItem;
            this.navCtrl.pop();
          }
          
        }
     
        
      
      }, 1000);
 
  }
  
  ionViewDidLoad() {
    
    this.menuCtrl.swipeEnable( false );
    this.menuCtrl.enable (false, 'myMenu');
  }
  ionViewWillEnter() {

    this.menuCtrl.swipeEnable( false );
    this.menuCtrl.enable (false, 'myMenu');
}
  //simpanStock() {
   // let loading = this.loadingCtrl.create({
     // spinner: 'hide',
      //content: 'Loading Please Wait...'
      //});
      //loading.present();
      
  
      //setTimeout(() => {
       // loading.dismiss();
        //this.toast.create({
      //message: `Berhasil`,
      //duration : 3000
     // }).present();
      
      //this.afAuth.authState.subscribe(auth => {
        //this.afDatabase.list(`stock/${auth.uid}`).push({
        //  id: auth.uid,
        //  namabrg: this.namaBrg,
        //  keterangan: this.ket 
       // })
        
       // .then(() => this.navCtrl.setRoot('HomePage'));
        
            
          //})
      
      
      
      //}, 2000);


    

    //}
  }

 

