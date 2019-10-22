import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController } from 'ionic-angular';
import { FirebaseObjectObservable, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { SaldoItem } from '../../models/saldo/saldo-item';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from '../../models/profile';
import { DepositList } from '../../models/deposit/deposit-list';
import { TarikKembaliPage } from '../tarik-kembali/tarik-kembali';
import { Status } from '../../models/status';
import { JumlahPendapatan } from '../../models/keuangan/jumlah-pendapatan';
import { JumlahPengeluaran } from '../../models/keuangan/jumlah-pengeluaran';
import { JumlahKeuntungan } from '../../models/keuangan/keuntungan';
import { HistoriKeuanganPage } from '../histori-keuangan/histori-keuangan';


/**
 * Generated class for the InfoAkunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-info-akun',
  templateUrl: 'info-akun.html',
})
export class InfoAkunPage {
  navigasi: number;
  depositListRef$: FirebaseObjectObservable<DepositList>;
  depositListRef: FirebaseListObservable<DepositList[]>;
  depositList = {} as DepositList;
  public userID;
  depositSubcription: Subscription;
  profiledataRef: FirebaseObjectObservable<Profile>
  profile = {} as Profile;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoItem = {} as SaldoItem;
  saldoSubcription: Subscription;
  statusRef: FirebaseObjectObservable<Status>;
  statusItem = {} as Status;
  jumlahPendapatanRef$: FirebaseObjectObservable<JumlahPendapatan>;
  jumlahpensubcription: Subscription;
  jumlahPen = {} as JumlahPendapatan;
  jumlahPengeluaranRef$: FirebaseObjectObservable<JumlahPengeluaran>;
  jumlahpengeluaransubcription: Subscription;
  jumlahPengeluaran = {} as JumlahPengeluaran;
  jumlahKeuntunganRef$: FirebaseObjectObservable<JumlahKeuntungan>;
  jumlahKeuntunganSub: Subscription;
  jumlahKeuntungan = {} as JumlahKeuntungan;
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  profileSubcription: Subscription;
  constructor( private toast: ToastController, private afAuth: AngularFireAuth, private database: AngularFireDatabase,  private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    
    const depositId = this.navParams.get('depositId');
    this.afAuth.authState.subscribe(auth => {
      if (auth) {this.userID = auth.uid}
        this.depositListRef$ = this.database.object(`deposit-list/${auth.uid}/${depositId}`);
      this.depositListRef = this.database.list(`deposit-list/${auth.uid}`);
      this.profiledataRef = this.database.object(`profile/${auth.uid}`); 
      this.saldoItemRef = this.database.object(`saldo-list/${auth.uid}`);
      this.jumlahPendapatanRef$ = this.database.object(`jumlah-pendapatan/${auth.uid}`);
      this.jumlahPengeluaranRef$ = this.database.object(`jumlah-pengeluaran/${auth.uid}`);
      this.jumlahKeuntunganRef$ = this.database.object(`jumlah-keuntungan/${auth.uid}`);
      
     
      this.profileSubcription = 
      this.profiledataRef.subscribe(
      profile => this.profile = profile);
      this.saldoSubcription = 
      this.saldoItemRef.subscribe(
      saldoItem => this.saldoItem = saldoItem);
      this.jumlahpensubcription = 
      this.jumlahPendapatanRef$.subscribe(
        jumlahPen => this.jumlahPen = jumlahPen);
      this.depositSubcription = this.depositListRef$.subscribe(
        depositList => this.depositList = depositList);
        this.jumlahpengeluaransubcription = 
      this.jumlahPengeluaranRef$.subscribe(
        jumlahPengeluaran => this.jumlahPengeluaran = jumlahPengeluaran);
     this.jumlahKeuntunganSub = this.jumlahKeuntunganRef$.subscribe(
        jumlahKeuntungan => this.jumlahKeuntungan = jumlahKeuntungan);
      
     });
     
  
  }
  
 
  
  isisaldo(valString) {
    
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unisisaldo(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);

  }

  unisisaldo(val) {
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
  ionViewDidLoad() {
    
   
   

    
    const depositId = this.navParams.get('depositId');
    

    
      if (depositId) {
     
        this.toast.create({
          message: `Berhasil`,
          duration : 2000
          }).present();
          this.depositList.status = 'Dibatalkan';
          this.depositList.nominal = this.depositList.nominal;
          this.depositList.nominalbiasa = this.depositList.nominalbiasa;
          this.depositList.tanggal = this.depositList.tanggal;
          this.depositList.harian = this.depositList.harian;
          this.depositListRef$.set({
            nominalbiasa: Number(this.depositList.nominalbiasa),
            nominal: this.depositList.nominal,
            tanggal: this.depositList.tanggal,
            status: this.depositList.status,
            harian: this.depositList.harian
          })
        
     
      //this.depositListRef.remove(depositList.$key);
     }
    
   
    console.log('ionViewDidLoad InfoAkunPage');
  }

  ionViewWillUnload() {
    
    if (this.navigasi == 1) {
      this.menuCtrl.swipeEnable( false );
      this.menuCtrl.enable (false, 'myMenu');
    }
    else{
      this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
    }
    //this.saldoSubcription.unsubscribe();
    //this.depositSubcription.unsubscribe();
    //this.jumlahpengeluaransubcription.unsubscribe();
    //this.jumlahpensubcription.unsubscribe();
    //this.jumlahKeuntunganSub.unsubscribe();
    
  }
  setting() {
    //this.navCtrl.push(TarikKembaliPage);
    this.navigasi = 1;
   this.navCtrl.push(TarikKembaliPage).then(() => {
            
     const index = this.navCtrl.getActive().index;
      this.navCtrl.remove(index-1);
      
     
   });
  }
  histori() {
    this.navCtrl.push(HistoriKeuanganPage);
  }
}
