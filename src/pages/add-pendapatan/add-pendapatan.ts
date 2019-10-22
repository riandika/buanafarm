import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { PendapatanItem } from '../../models/pendapatan/pendapatan-list';
import { AngularFireAuth } from 'angularfire2/auth';
import { SaldoItem } from '../../models/saldo/saldo-item';
import { Subscription } from 'rxjs/Subscription';
import { JumlahPendapatan } from '../../models/keuangan/jumlah-pendapatan';
import { HistoriJumlah } from '../../models/keuangan/histori-jumlah';
import { JumlahPengeluaran } from '../../models/keuangan/jumlah-pengeluaran';
import { JumlahKeuntungan } from '../../models/keuangan/keuntungan';
import { HistoriPengeluaran } from '../../models/keuangan/histori-pengeluaran';
import { HistoriKeuntungan } from '../../models/keuangan/histori-keuntungan';
import * as moment from 'moment';
/**
 * Generated class for the AddPendapatanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-pendapatan',
  templateUrl: 'add-pendapatan.html',
})
export class AddPendapatanPage {

  pendapatanRef: FirebaseListObservable<PendapatanItem[]>;
  pendapatanItem = {} as PendapatanItem;
  historiJumlahRef: FirebaseListObservable<HistoriJumlah[]>;
  historiJumlah={} as HistoriJumlah;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoSubcription : Subscription;
  saldoItem = {} as SaldoItem;
  jumlahPendapatanRef$: FirebaseObjectObservable<JumlahPendapatan>;
  jumlahpensubcription: Subscription;
  jumlahPen = {} as JumlahPendapatan;
 
  bulantahun;
  
  jumlahPengeluaranRef$: FirebaseObjectObservable<JumlahPengeluaran>;
  jumlahpengeluaransubcription: Subscription;
  jumlahPengeluaran = {} as JumlahPengeluaran;
  jumlahKeuntunganRef$: FirebaseObjectObservable<JumlahKeuntungan>;
  jumlahKeuntunganSub: Subscription;
  jumlahKeuntungan = {} as JumlahKeuntungan;
  historiPengeluaranRef: FirebaseListObservable<HistoriPengeluaran[]>;
  historiPengeluaran={} as HistoriPengeluaran;
  
  historiKeuntunganRef: FirebaseListObservable<HistoriKeuntungan[]>;
  historiKeuntungan = {} as HistoriKeuntungan;
  constructor(public navCtrl: NavController, private database: AngularFireDatabase, private toast: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth,  public navParams: NavParams) {
    //this.BulanTahun= this.getFormatedDate();
    this.pendapatanItem.bulanTahun = this.getFormatedDate();
    
    this.afAuth.authState.subscribe(auth => {
      this.pendapatanRef = this.database.list(`pendapatan-list/${auth.uid}`);
      this.saldoItemRef = this.database.object(`saldo-list/${auth.uid}`);
      this.jumlahPendapatanRef$ = this.database.object(`jumlah-pendapatan/${auth.uid}`);
      this.historiJumlahRef = this.database.list(`histori-jumlah/${auth.uid}`);
      this.jumlahPengeluaranRef$ = this.database.object(`jumlah-pengeluaran/${auth.uid}`);
      this.jumlahKeuntunganRef$ = this.database.object(`jumlah-keuntungan/${auth.uid}`);
      this.historiPengeluaranRef = this.database.list(`histori-pengeluaran/${auth.uid}`);
      this.historiKeuntunganRef = this.database.list(`histori-keuntungan/${auth.uid}`);
      this.saldoSubcription = 
      this.saldoItemRef.subscribe(
      saldoItem => this.saldoItem = saldoItem);
      this.jumlahpensubcription = 
      this.jumlahPendapatanRef$.subscribe(
      jumlahPen => this.jumlahPen = jumlahPen);
      this.jumlahpengeluaransubcription = 
      this.jumlahPengeluaranRef$.subscribe(
      jumlahPengeluaran => this.jumlahPengeluaran = jumlahPengeluaran);
      this.jumlahKeuntunganSub = this.jumlahKeuntunganRef$.subscribe(
      jumlahKeuntungan => this.jumlahKeuntungan = jumlahKeuntungan);
     });
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPendapatanPage');
  }
 
  ionViewWillUnload() {
    this.jumlahpensubcription.unsubscribe();
    this.saldoSubcription.unsubscribe();
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
  getFormatedDate() {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString()
    var mont = dateObj.getMonth().toString()
    
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    this.bulantahun = montArray[mont] + '/' + year
  }

  
  simpanPendapatan(pendapatanItem: PendapatanItem) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
  
      setTimeout(() => {
          this.pendapatanItem.tanggal = moment().format();
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
            if (this.saldoItem.saldo == null) {
              this.saldoItem.saldo = 0;
            }else {
              this.saldoItem.saldo = this.saldoItem.saldo;
              
            }
            this.saldoItem.saldo = Number(this.saldoItem.saldo) + Number(this.pendapatanItem.jumlah);
            
            this.saldoItemRef.set({
              saldo : Number(this.saldoItem.saldo)
              
            })
            if (this.jumlahPen.totalPendapatan == null || !this.jumlahPen.totalPendapatan){
              this.jumlahPen.bulanTahun = this.pendapatanItem.bulanTahun;
              this.jumlahPen.totalPendapatan = this.pendapatanItem.jumlah;
              this.jumlahPendapatanRef$.set({
                totalPendapatan: Number(this.jumlahPen.totalPendapatan),
                bulanTahun: this.jumlahPen.bulanTahun
              })
              
            }
            else {
              if (this.pendapatanItem.bulanTahun == this.jumlahPen.bulanTahun){
                this.jumlahPen.totalPendapatan = Number(this.jumlahPen.totalPendapatan) + Number(this.pendapatanItem.jumlah);
                this.jumlahPendapatanRef$.update(this.jumlahPen);
                
                }
            
              else {
                
                this.historiJumlah.historiBulanTahun = this.jumlahPen.bulanTahun;
                this.historiJumlah.historiPendapatan = this.jumlahPen.totalPendapatan;
                
                this.historiJumlahRef.push({
                  historiBulanTahun: this.historiJumlah.historiBulanTahun,
                  historiPendapatan: this.historiJumlah.historiPendapatan
                });

                this.jumlahPen.bulanTahun = this.pendapatanItem.bulanTahun;
                this.jumlahPen.totalPendapatan = this.pendapatanItem.jumlah;
                this.jumlahPendapatanRef$.set({
                totalPendapatan: Number(this.jumlahPen.totalPendapatan),
                bulanTahun: this.jumlahPen.bulanTahun
                })
        
              }
            }
            loading.dismiss();
            this.toast.create({
            message: `Berhasil Menyimpan`,
            duration : 3000
            }).present();
            this.pendapatanItem = {} as PendapatanItem;
            this.navCtrl.pop();
          
          
    
      
      }, 1000);
 
  }
  

}
