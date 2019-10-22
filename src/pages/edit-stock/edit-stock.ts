import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { StockItem } from '../../models/stock-item/stock-item.interface';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';




@Component({
  selector: 'page-edit-stock',
  templateUrl: 'edit-stock.html',
})
export class EditStockPage {
  filteredItems: Array<StockItem>;
  jikasama: number = 0;
  nohapus : number = 0;
  stockItemSubcription: Subscription;
  stockItemRef$: FirebaseObjectObservable<StockItem>;
  stockItemRef: FirebaseListObservable<StockItem[]>;
  stockItem = {} as StockItem;
  public userID;
  formatedDate;
  //wadahnya;
  public isToggled: boolean;
  public isToggled2: boolean;
  nmbrg1;
  nmbrg2;
  stn1;
  stn2;
  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public loadingCtrl: LoadingController, private database: AngularFireDatabase , public navCtrl: NavController, public navParams: NavParams) {
    
    
    this.getFormatedDate();
      const stockItemId = this.navParams.get('stockItemId');
      this.afAuth.authState.subscribe(user => {
        if (user) {this.userID = user.uid}
        this.stockItemRef$ = this.database.object(`stock-list/${user.uid}/${stockItemId}`);
        this.stockItemRef = this.database.list(`stock-list/${user.uid}`);
      this.stockItemSubcription = 
      this.stockItemRef$.subscribe(
      stockItem => this.stockItem = stockItem);
    
      });
      
  }

  ionViewDidLoad() {
    //this.wadahnya = this.stockItem.namaBrg;
    if(this.stockItem.status ==1){
      this.isToggled = true;
      this.nmbrg1 = 0
      this.nmbrg2 = 1;
      this.stockItem.status = 1;
    }
    else if(this.stockItem.status == 0){
      this.isToggled = false;
      this.nmbrg2 = 0;
      this.nmbrg1=1;
      this.stockItem.status = 0;
    }

    if(this.stockItem.status2 == 1){
      this.isToggled2 = true;
      this.stn2 = 1;
      this.stn1 = 0;
      this.stockItem.status2 = 1;
    }
    else if (this.stockItem.status2 == 0) {
      this.isToggled2 = false;
      this.stn2 = 0;
      this.stn1 = 1;
      this.stockItem.status2 = 0;
    }

    this.nohapus = 0;
   
  }
  getFormatedDate() {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString()
    var mont = dateObj.getMonth().toString()
    var date = dateObj.getDate().toString()
    var time = dateObj.getHours().toString()
    var Menit = dateObj.getMinutes().toString()
    var detik = dateObj.getSeconds().toString()
    var jamArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','00']
    var menitArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    '25','26', '27','28','29','30','31','32','33','34', '35','36','37','38','39','40','41','42','43','44','45','46','47', '48','49','50','51','52','53','54','55','56','57','58','59','60']
    var tglArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    '25','26', '27','28','29','30','31']
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    this.formatedDate = (tglArray[date]) + '/' + montArray[mont] + '/' + year + ' ' + jamArray[time] +':'+ menitArray[Menit]+':'+detik
    
  }
 
 /* onSelectChange(event){
   if(this.stockItem.namaBrg == this.wadahnya){
    this.jikasama = 0;
   }
   else{
    this.jikasama = 0;
    let queryTextLower = this.stockItem.namaBrg.toLowerCase();
    
    this.stockItemRef.subscribe((_stockListRef) => {
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
   }

    
 }
*/
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

  editStock(stockItem: any) {
    this.nohapus = 1;
    this.stockItem.tanggal = moment().format();
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
  
      setTimeout(() => {
        

        loading.dismiss();
        this.toast.create({
      message: `Berhasil Menyimpan`,
      duration : 3000
      }).present();
      //this.stockItemRef$.update(stockItem);
          if (this.stockItem.namaBrg == null || this.stockItem.satuan == null || this.stockItem.jumlahBrg == null)
          {
            
            loading.dismiss();
            this.toast.create({
              message: 'Harap Di Isi',
              duration : 3000
              }).present(); 
              
          }
          
          else {
            if (this.stockItem.note == null) {
              
              this.stockItemRef.push({
          
                namaBrg: this.stockItem.namaBrg,
                tanggal: this.stockItem.tanggal,
                jumlahBrg: Number(this.stockItem.jumlahBrg),
                status: this.stockItem.status,
              status2: this.stockItem.status2,
                satuan: this.stockItem.satuan
                //note : this.stockItem.note
                
              });
              
              this.stockItem = {} as StockItem;
              this.navCtrl.pop();

            }
            else {
              this.stockItemRef.push({
                
                namaBrg: this.stockItem.namaBrg,
                tanggal: this.stockItem.tanggal,
                jumlahBrg: Number(this.stockItem.jumlahBrg),
                status: this.stockItem.status,
              status2: this.stockItem.status2,
                satuan: this.stockItem.satuan,
                note : this.stockItem.note
                
              });
              
              this.stockItem = {} as StockItem;
              this.navCtrl.pop();
            }
            
          }

      
      
      }, 1000);
    
      
      
    
  }

  ionViewWillLeave() {
    if (this.nohapus == 1) {
      this.stockItemRef$.remove();
    }
    
    this.stockItemSubcription.unsubscribe();
  }



}
