import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, MenuController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { DepositList } from '../../models/deposit/deposit-list';
import { AngularFireAuth } from 'angularfire2/auth';
import { InfoAkunPage } from '../info-akun/info-akun';
import { SaldoItem } from '../../models/saldo/saldo-item';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the TarikKembaliPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tarik-kembali',
  templateUrl: 'tarik-kembali.html',
})
export class TarikKembaliPage {
  
  depositListRef: FirebaseListObservable<DepositList[]>;
  depositList = {} as DepositList;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoItem = {} as SaldoItem;
  saldoSubcription: Subscription;
  //statusRef: FirebaseObjectObservable<Status>;
  //statusItem = {} as Status;
  hariini;
  hariini2;
  
  constructor(private menuCtrl: MenuController, private actionSheetCtrl: ActionSheetController,  private toast: ToastController, private afAuth: AngularFireAuth, private database: AngularFireDatabase,  public navCtrl: NavController, public navParams: NavParams) {
    this.hariini = this.getFormatedDate();
    this.afAuth.authState.subscribe(auth => {
      
      this.depositListRef = this.database.list(`deposit-list/${auth.uid}`);
     // this.statusRef = this.database.object(`status-list/${auth.uid}`);
     this.saldoItemRef = this.database.object(`saldo-list/${auth.uid}`);
    
      this.saldoSubcription = 
      this.saldoItemRef.subscribe(
      saldoItem => this.saldoItem = saldoItem);

     });
  }
  getFormatedDate() {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString()
    var mont = dateObj.getMonth().toString()
    var date = dateObj.getDate().toString()
    
     var tglArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    '25','26', '27','28','29','30','31']
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    this.hariini2 = (tglArray[date]) + '/' + montArray[mont] + '/' + year
    

    //var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    //this.formatedDate = date + '/' + montArray[mont] + '/' + year + ' ' + time+':'+Menit+':'+detik
  }
  selectStockItem(depositList: DepositList) {
    this.actionSheetCtrl.create({
      
      buttons: [
      {
        text: 'Batalkan',
        role: 'destructive',
        handler: () => {
          
            if(this.hariini == depositList.harian){
              if (depositList.status == 'Dibatalkan') {
                this.toast.create({
                  message: `Maaf, data ini sudah dibatalkan`,
                  duration : 1000
                  }).present();
              }else {
                if (this.saldoItem.saldo < depositList.nominalbiasa){
                  this.toast.create({
                    message: `Maaf uang anda tidak cukup untuk di dibatalkan`,
                    duration : 2000
                    }).present();
                }
                else {
                  
                  this.saldoItem.saldo = Number(this.saldoItem.saldo) - Number(depositList.nominalbiasa);
              
                  this.saldoItemRef.set({
                    saldo : Number(this.saldoItem.saldo)
                    
                  })
                  
                  this.navCtrl.push(InfoAkunPage,  { depositId: depositList.$key}).then(() => {
                
                    const index = this.navCtrl.getActive().index;
                    this.navCtrl.remove(index-1);
                   
                   
                  });
                }
              }
                
              
            }else{
              this.toast.create({
                message: `Maaf, data sudah tidak berlaku lagi`,
                duration : 1500
                }).present();
            }
            
             
             
            
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
  close() {
    this.navCtrl.push(InfoAkunPage).then(() => {
            
      const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(index-1);
     
     
    });
  }
  ionViewDidLoad() {
    this.menuCtrl.swipeEnable( false );
    this.menuCtrl.enable (false, 'myMenu');
    console.log('ionViewDidLoad TarikKembaliPage');
  }
  ionViewWillUnload() {
    
    this.saldoSubcription.unsubscribe();
    
  }
}
