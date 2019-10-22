import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { DepositList } from '../../models/deposit/deposit-list';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { SaldoItem } from '../../models/saldo/saldo-item';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment';





@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {
 
  depositListRef: FirebaseListObservable<DepositList[]>;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoSubcription : Subscription;
  saldoItem = {} as SaldoItem;
  depositList = {} as DepositList;
  haribulantahun;
  but1: any;
  but2: any;
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  holder='Nominal';
 
  constructor( private actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth, private toast: ToastController, public alertCtrl: AlertController, private database: AngularFireDatabase, private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
   
    this.but1 = 1;
    this.depositList.harian = this.getFormatedDate();
    this.afAuth.authState.subscribe(auth => {
     
      this.depositListRef = this.database.list(`deposit-list/${auth.uid}`);  
      this.saldoItemRef = this.database.object(`saldo-list/${auth.uid}`);
      this.saldoSubcription = 
      this.saldoItemRef.subscribe(
      saldoItem => this.saldoItem = saldoItem);
     });
          

  }
  
  
  format2(valString) {
    
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat2(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{0})+(?!\d))/g, this.GROUP_SEPARATOR);

  }

  unFormat2(val) {
    if (!val) {
        return '';
    }
    val = val.replace(/^0+/, '').replace(/\D/g,'');
    if (this.GROUP_SEPARATOR === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
  }
  
  format(valString) {
    
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);

  }

  unFormat(val) {
    if (!val) {
        return '';
    }
    val = val.replace(/^0+/, '').replace(/\D/g,'');
    if (this.GROUP_SEPARATOR === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
  }
  
  getFormatedDate() {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString()
    var mont = dateObj.getMonth().toString()
    var date = dateObj.getDate().toString()
    
     var tglArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    '25','26', '27','28','29','30','31']
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    this.haribulantahun = (tglArray[date]) + '/' + montArray[mont] + '/' + year
    

    //var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    //this.formatedDate = date + '/' + montArray[mont] + '/' + year + ' ' + time+':'+Menit+':'+detik
  }
 
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad DepositPage');
  }
  ionViewWillUnload() {
    this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
    this.saldoSubcription.unsubscribe();
  }
  minta() {
    this.but2= 1;
    this.but1 = 0;
    
  }
  batal() {
    this.but2 = 0;
    this.but1= 1;
    
  }
  simpan(depositList: DepositList){
    if (!this.depositList.nominalbiasa || this.depositList.nominalbiasa <= 0) {
     
      this.toast.create({
      message: `Harap di isi`,
      duration : 3000
      }).present();
    }
    else {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Mohon Tunggu...'
        });
        loading.present();
        
        setTimeout(() => {
           this.depositList.status = 'Berhasil';
           this.depositList.tanggal = moment().format();
           
            this.depositListRef.push({
                nominalbiasa: Number(this.depositList.nominalbiasa),
                nominal: this.depositList.nominal,
                tanggal: this.depositList.tanggal,
                status: this.depositList.status,
                harian : this.depositList.harian
            });
            if (this.saldoItem.saldo == null) {
              this.saldoItem.saldo = 0;
            }else {
              this.saldoItem.saldo = this.saldoItem.saldo;
              
            }
            this.saldoItem.saldo = Number(this.saldoItem.saldo) + Number(this.depositList.nominalbiasa);
            
            this.saldoItemRef.set({
              saldo : Number(this.saldoItem.saldo)
              
            })

            loading.dismiss();
            this.toast.create({
            message: `Berhasil Deposit`,
            duration : 3000
            }).present();
            this.depositList = {} as DepositList;
            
            this.navCtrl.push(DepositPage).then(() => {
              
              const index = this.navCtrl.getActive().index;
              this.navCtrl.remove(index-1);
             
          });
        }, 1000);
    }
    
  }
  selectStockItem(depositList: any) {
    this.actionSheetCtrl.create({
      
      buttons: [
      {
        text: 'Hapus dari daftar',
        role: 'destructive',
        handler: () => {
          this.toast.create({
            message: `Daftar telah dihapus`,
            duration : 1000
            }).present();
          this.depositListRef.remove(depositList.$key);
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

}
