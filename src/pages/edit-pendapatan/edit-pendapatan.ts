import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { PendapatanItem } from '../../models/pendapatan/pendapatan-list';
import { Subscription } from 'rxjs/Subscription';
import { SaldoItem } from '../../models/saldo/saldo-item';
import { JumlahPendapatan } from '../../models/keuangan/jumlah-pendapatan';
import { JumlahPengeluaran } from '../../models/keuangan/jumlah-pengeluaran';
import { JumlahKeuntungan } from '../../models/keuangan/keuntungan';
import { HistoriPengeluaran } from '../../models/keuangan/histori-pengeluaran';
import { HistoriKeuntungan } from '../../models/keuangan/histori-keuntungan';
import { HistoriJumlah } from '../../models/keuangan/histori-jumlah';
import * as moment from 'moment';
/**
 * Generated class for the EditPendapatanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-pendapatan',
  templateUrl: 'edit-pendapatan.html',
})
export class EditPendapatanPage {
  pendapatanRef$: FirebaseObjectObservable<PendapatanItem>;
  pendapatanRef: FirebaseListObservable<PendapatanItem[]>;
  pendapatanItem = {} as PendapatanItem;
  pendapatanSubcription : Subscription;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoSubcription : Subscription;
  saldoItem = {} as SaldoItem;
  jumlahPendapatanRef$: FirebaseObjectObservable<JumlahPendapatan>;
  jumlahpensubcription: Subscription;
  jumlahPen = {} as JumlahPendapatan;
  jumlahsementara;
  public userID;

  bulantahun;
  nohapus : number = 0;
  jumlahPengeluaranRef$: FirebaseObjectObservable<JumlahPengeluaran>;
  jumlahpengeluaransubcription: Subscription;
  jumlahPengeluaran = {} as JumlahPengeluaran;
  jumlahKeuntunganRef$: FirebaseObjectObservable<JumlahKeuntungan>;
  jumlahKeuntunganSub: Subscription;
  jumlahKeuntungan = {} as JumlahKeuntungan;
  historiPengeluaranRef: FirebaseListObservable<HistoriPengeluaran[]>;
  historiPengeluaran={} as HistoriPengeluaran;
  historiJumlahRef: FirebaseListObservable<HistoriJumlah[]>;
  historiJumlah={} as HistoriJumlah;
  historiKeuntunganRef: FirebaseListObservable<HistoriKeuntungan[]>;
  historiKeuntungan = {} as HistoriKeuntungan;
  constructor(private database: AngularFireDatabase, private toast: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.getFormatedDate();
    const pendapatanItemId = this.navParams.get('pendapatanItemId');
      this.afAuth.authState.subscribe(user => {
        if (user) {this.userID = user.uid}
        this.pendapatanRef$ = this.database.object(`pendapatan-list/${user.uid}/${pendapatanItemId}`);
        this.pendapatanRef = this.database.list(`pendapatan-list/${user.uid}`);
        this.saldoItemRef = this.database.object(`saldo-list/${user.uid}`);
        this.jumlahPendapatanRef$ = this.database.object(`jumlah-pendapatan/${user.uid}`);
        this.historiJumlahRef = this.database.list(`histori-jumlah/${user.uid}`);
        this.jumlahPengeluaranRef$ = this.database.object(`jumlah-pengeluaran/${user.uid}`);
        this.jumlahKeuntunganRef$ = this.database.object(`jumlah-keuntungan/${user.uid}`);
        this.historiPengeluaranRef = this.database.list(`histori-pengeluaran/${user.uid}`);
        this.historiKeuntunganRef = this.database.list(`histori-keuntungan/${user.uid}`);
      this.saldoSubcription = 
      this.saldoItemRef.subscribe(
      saldoItem => this.saldoItem = saldoItem);
      this.jumlahpengeluaransubcription = 
      this.jumlahPengeluaranRef$.subscribe(
      jumlahPengeluaran => this.jumlahPengeluaran = jumlahPengeluaran);
      this.jumlahKeuntunganSub = this.jumlahKeuntunganRef$.subscribe(
      jumlahKeuntungan => this.jumlahKeuntungan = jumlahKeuntungan);
      this.pendapatanSubcription = 
      this.pendapatanRef$.subscribe(
        pendapatanItem => this.pendapatanItem = pendapatanItem);
      this.jumlahpensubcription = 
      this.jumlahPendapatanRef$.subscribe(
        jumlahPen => this.jumlahPen = jumlahPen);
        
      });
  }
  getFormatedDate() {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString()
    var mont = dateObj.getMonth().toString()
    
    
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    this.bulantahun = montArray[mont] + '/' + year
  }

  ionViewDidLoad() {
    this.jumlahsementara = Number(this.pendapatanItem.jumlah);
    console.log('ionViewDidLoad EditPendapatanPage');
  }
  
  ionViewWillUnload() {
    if (this.nohapus == 1) {
    this.pendapatanRef$.remove();
    }
    this.pendapatanSubcription.unsubscribe();
    this.saldoSubcription.unsubscribe();
    this.jumlahpensubcription.unsubscribe();
    if(!this.jumlahPen.totalPendapatan && !this.jumlahPengeluaran.totalPengeluaran){
      if(this.jumlahKeuntungan.bulanTahun && this.jumlahKeuntungan.bulanTahun != this.bulantahun){
        this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
        this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
        this.historiKeuntunganRef.push({
          historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
          historiKeuntungan: this.historiKeuntungan.historiKeuntungan
        });
        this.jumlahKeuntunganRef$.remove();
        this.jumlahKeuntungan.totalKeuntungan = 0;
      }
      else{
        this.jumlahKeuntungan.totalKeuntungan = 0;
      }
      
      
    }
    else if(!this.jumlahPen.totalPendapatan){
      
      
      if(this.jumlahPengeluaran.bulanTahun != this.bulantahun) {
      
      this.historiPengeluaran.historiBulanTahun = this.jumlahPengeluaran.bulanTahun;
      this.historiPengeluaran.historiPengeluran = this.jumlahPengeluaran.totalPengeluaran;
      
      this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
      this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
      this.historiKeuntunganRef.push({
        historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
        historiKeuntungan: this.historiKeuntungan.historiKeuntungan
      });
      this.historiPengeluaranRef.push({
        historiBulanTahun: this.historiPengeluaran.historiBulanTahun,
        historiPengeluran: this.historiPengeluaran.historiPengeluran
      });
      
      this.jumlahPengeluaranRef$.remove();
      
       
        this.jumlahKeuntunganRef$.remove();
        this.jumlahKeuntungan.totalKeuntungan = 0;
      

      
    }
    else{
      if(this.jumlahKeuntungan.bulanTahun && this.jumlahKeuntungan.bulanTahun != this.bulantahun){
        this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
        this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
        this.historiKeuntunganRef.push({
          historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
          historiKeuntungan: this.historiKeuntungan.historiKeuntungan
        });
        this.jumlahKeuntunganRef$.remove();
        this.jumlahKeuntungan.totalKeuntungan = 0;
      }
      this.jumlahPen.totalPendapatan = 0;
      this.jumlahKeuntungan.bulanTahun = this.jumlahPengeluaran.bulanTahun;
    this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
    
      this.jumlahKeuntunganRef$.set({
        bulanTahun : this.jumlahKeuntungan.bulanTahun,
        totalKeuntungan : Number(this.jumlahKeuntungan.totalKeuntungan)
      })
    
    }
      
  }
  else if(!this.jumlahPengeluaran.totalPengeluaran){
    if (this.jumlahPen.bulanTahun != this.bulantahun){
      
      this.historiJumlah.historiBulanTahun = this.jumlahPen.bulanTahun;
      this.historiJumlah.historiPendapatan = this.jumlahPen.totalPendapatan;
      this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
      this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
      this.historiKeuntunganRef.push({
        historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
        historiKeuntungan: this.historiKeuntungan.historiKeuntungan
      });
      this.historiJumlahRef.push({
        historiBulanTahun: this.historiJumlah.historiBulanTahun,
        historiPendapatan: this.historiJumlah.historiPendapatan
      });

      this.jumlahPendapatanRef$.remove();
      
      this.jumlahKeuntunganRef$.remove();
      this.jumlahKeuntungan.totalKeuntungan = 0;
    
    }
    else {
      if(this.jumlahKeuntungan.bulanTahun && this.jumlahKeuntungan.bulanTahun != this.bulantahun){
        this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
        this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
        this.historiKeuntunganRef.push({
          historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
          historiKeuntungan: this.historiKeuntungan.historiKeuntungan
        });
        this.jumlahKeuntunganRef$.remove();
        this.jumlahKeuntungan.totalKeuntungan = 0;
      }
      this.jumlahKeuntungan.bulanTahun = this.jumlahPen.bulanTahun;
      this.jumlahPengeluaran.totalPengeluaran = 0;
      this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
     
      this.jumlahKeuntunganRef$.set({
        bulanTahun : this.jumlahKeuntungan.bulanTahun,
        totalKeuntungan : Number(this.jumlahKeuntungan.totalKeuntungan)
      })
      
      
    }
      
    
  }
  else {
    if(this.jumlahPen.bulanTahun != this.bulantahun && this.jumlahPengeluaran.bulanTahun != this.bulantahun){
      this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
      this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
      this.historiKeuntunganRef.push({
        historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
        historiKeuntungan: this.historiKeuntungan.historiKeuntungan
      });
      this.historiJumlah.historiBulanTahun = this.jumlahPen.bulanTahun;
      this.historiJumlah.historiPendapatan = this.jumlahPen.totalPendapatan;
      
      this.historiJumlahRef.push({
        historiBulanTahun: this.historiJumlah.historiBulanTahun,
        historiPendapatan: this.historiJumlah.historiPendapatan
      });

      this.jumlahPendapatanRef$.remove();
    this.historiPengeluaran.historiBulanTahun = this.jumlahPengeluaran.bulanTahun;
      this.historiPengeluaran.historiPengeluran = this.jumlahPengeluaran.totalPengeluaran;
      
      this.historiPengeluaranRef.push({
        historiBulanTahun: this.historiPengeluaran.historiBulanTahun,
        historiPengeluran: this.historiPengeluaran.historiPengeluran
      });

    this.jumlahPengeluaranRef$.remove();
    
      this.jumlahKeuntunganRef$.remove();
    
    }else if(this.jumlahPen.bulanTahun != this.bulantahun) {
      this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
      this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
      this.historiKeuntunganRef.push({
        historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
        historiKeuntungan: this.historiKeuntungan.historiKeuntungan
      });
      this.historiJumlah.historiBulanTahun = this.jumlahPen.bulanTahun;
      this.historiJumlah.historiPendapatan = this.jumlahPen.totalPendapatan;
      
     
      this.historiJumlahRef.push({
        historiBulanTahun: this.historiJumlah.historiBulanTahun,
        historiPendapatan: this.historiJumlah.historiPendapatan
      });

      this.jumlahPendapatanRef$.remove();
    
      this.jumlahKeuntunganRef$.remove();
      this.jumlahPen.totalPendapatan = 0;
      this.jumlahKeuntungan.bulanTahun = this.bulantahun;
      this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
      
        this.jumlahKeuntunganRef$.set({
          bulanTahun : this.jumlahKeuntungan.bulanTahun,
          totalKeuntungan : Number(this.jumlahKeuntungan.totalKeuntungan)
        })
    
    }else if(this.jumlahPengeluaran.bulanTahun != this.bulantahun){
      
      this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
      this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
      this.historiKeuntunganRef.push({
        historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
        historiKeuntungan: this.historiKeuntungan.historiKeuntungan
      });
      this.historiPengeluaran.historiBulanTahun = this.jumlahPengeluaran.bulanTahun;
      this.historiPengeluaran.historiPengeluran = this.jumlahPengeluaran.totalPengeluaran;
      
      this.historiPengeluaranRef.push({
        historiBulanTahun: this.historiPengeluaran.historiBulanTahun,
        historiPengeluran: this.historiPengeluaran.historiPengeluran
      });

      this.jumlahPengeluaranRef$.remove();
    
      this.jumlahKeuntunganRef$.remove();
      this.jumlahPengeluaran.totalPengeluaran = 0;
      this.jumlahKeuntungan.bulanTahun = this.bulantahun;
      this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
      
        this.jumlahKeuntunganRef$.set({
          bulanTahun : this.jumlahKeuntungan.bulanTahun,
          totalKeuntungan : Number(this.jumlahKeuntungan.totalKeuntungan)
        })
    }
    else{
      if(this.jumlahKeuntungan.bulanTahun && this.jumlahKeuntungan.bulanTahun != this.bulantahun){
        this.historiKeuntungan.historiBulanTahun = this.jumlahKeuntungan.bulanTahun;
        this.historiKeuntungan.historiKeuntungan = this.jumlahKeuntungan.totalKeuntungan;
        this.historiKeuntunganRef.push({
          historiBulanTahun: this.historiKeuntungan.historiBulanTahun,
          historiKeuntungan: this.historiKeuntungan.historiKeuntungan
        });
        this.jumlahKeuntunganRef$.remove();
      }
      this.jumlahKeuntungan.bulanTahun = this.bulantahun;
      this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
      
        this.jumlahKeuntunganRef$.set({
          bulanTahun : this.jumlahKeuntungan.bulanTahun,
          totalKeuntungan : Number(this.jumlahKeuntungan.totalKeuntungan)
        })
      
    }
    
    
  }
  }
  simpanPendapatan(pendapatanItem: PendapatanItem) {
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
  
      setTimeout(() => {
     
       if (Number(this.pendapatanItem.jumlah) < ((Number(this.saldoItem.saldo) - Number(this.jumlahsementara)) * -1)) {
          loading.dismiss();
          this.toast.create({
          message: `Maaf anda tidak bisa mengubah karena uang anda sudah terpakai`,
          duration : 3000
          }).present();
       }
       else {
        this.nohapus = 1;
       this.pendapatanItem.bulanTahun=this.bulantahun;
        this.pendapatanItem.tanggal = moment().format();
        this.saldoItem.saldo = (Number(this.saldoItem.saldo) - Number(this.jumlahsementara)) + Number(this.pendapatanItem.jumlah);
            
        this.saldoItemRef.set({
          saldo : Number(this.saldoItem.saldo)
          
        })
        this.jumlahPen.totalPendapatan = (Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahsementara)) + Number(this.pendapatanItem.jumlah);
        this.jumlahPendapatanRef$.update(this.jumlahPen);
       // if(!this.jumlahPengeluaran.totalPengeluaran){
          //this.jumlahPengeluaran.totalPengeluaran = 0;
          //this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
          //this.jumlahKeuntunganRef$.update(this.jumlahKeuntungan);
        //}else{
         // this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
         // this.jumlahKeuntunganRef$.update(this.jumlahKeuntungan);
       // }
      if (this.pendapatanItem.note == null) {
       
        this.pendapatanRef.push({
          bulanTahun: this.pendapatanItem.bulanTahun,
          tanggal: this.pendapatanItem.tanggal,
          sumber: this.pendapatanItem.sumber,
          jumlah: Number(this.pendapatanItem.jumlah)
        });
      }
      else {
        this.pendapatanRef.push({
          bulanTahun: this.pendapatanItem.bulanTahun,
          tanggal: this.pendapatanItem.tanggal,
          sumber: this.pendapatanItem.sumber,
          jumlah: Number(this.pendapatanItem.jumlah),
          note: this.pendapatanItem.note
        });
          }
          
          loading.dismiss();
          this.toast.create({
          message: `Berhasil Menyimpan`,
          duration : 3000
          }).present();
          this.pendapatanItem = {} as PendapatanItem;
          this.navCtrl.pop();
    
       }
            
            
      
      }, 1000);
  }
}
