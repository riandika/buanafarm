import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { PengeluaranItem } from '../../models/pengeluaran/pengeluaran-list';
import { AngularFireAuth } from 'angularfire2/auth';
import { SaldoItem } from '../../models/saldo/saldo-item';
import { Subscription } from 'rxjs/Subscription';
import { JumlahPengeluaran } from '../../models/keuangan/jumlah-pengeluaran';
import { HistoriPengeluaran } from '../../models/keuangan/histori-pengeluaran';
import { JumlahPendapatan } from '../../models/keuangan/jumlah-pendapatan';
import { JumlahKeuntungan } from '../../models/keuangan/keuntungan';
import { HistoriJumlah } from '../../models/keuangan/histori-jumlah';
import { HistoriKeuntungan } from '../../models/keuangan/histori-keuntungan';
import * as moment from 'moment';
/**
 * Generated class for the AddPengeluaranPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-pengeluaran',
  templateUrl: 'add-pengeluaran.html',
})
export class AddPengeluaranPage {
  nmbrg1;
  nmbrg2;
  stn1;
  stn2;
  public isToggled: boolean;
  public isToggled2: boolean;
  pengeluaranRef: FirebaseListObservable<PengeluaranItem[]>;
  pengeluaranItem = {} as PengeluaranItem;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoSubcription : Subscription;
  saldoItem = {} as SaldoItem;
  jumlahPengeluaranRef$: FirebaseObjectObservable<JumlahPengeluaran>;
  jumlahpengeluaransubcription: Subscription;
  jumlahPengeluaran = {} as JumlahPengeluaran;
  historiPengeluaranRef: FirebaseListObservable<HistoriPengeluaran[]>;
  historiPengeluaran={} as HistoriPengeluaran;
 
  bulantahun;
  jumlahPendapatanRef$: FirebaseObjectObservable<JumlahPendapatan>;
  jumlahpensubcription: Subscription;
  jumlahPen = {} as JumlahPendapatan;
  
  jumlahKeuntunganRef$: FirebaseObjectObservable<JumlahKeuntungan>;
  jumlahKeuntunganSub: Subscription;
  jumlahKeuntungan = {} as JumlahKeuntungan;
  
  historiJumlahRef: FirebaseListObservable<HistoriJumlah[]>;
  historiJumlah={} as HistoriJumlah;
  historiKeuntunganRef: FirebaseListObservable<HistoriKeuntungan[]>;
  historiKeuntungan = {} as HistoriKeuntungan;
  constructor(private database: AngularFireDatabase, private toast: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.isToggled = false;
    this.isToggled2 = false;
    this.pengeluaranItem.status = 0;
    this.pengeluaranItem.status2 = 0;
    this.nmbrg1 = 1;
    this.stn1 = 1;
    this.pengeluaranItem.bulanTahun = this.getFormatedDate();
   
    this.afAuth.authState.subscribe(auth => {
      this.pengeluaranRef = this.database.list(`pengeluaran-list/${auth.uid}`);
      this.saldoItemRef = this.database.object(`saldo-list/${auth.uid}`);
      this.jumlahPengeluaranRef$ = this.database.object(`jumlah-pengeluaran/${auth.uid}`);
      this.historiPengeluaranRef = this.database.list(`histori-pengeluaran/${auth.uid}`);
      this.jumlahPendapatanRef$ = this.database.object(`jumlah-pendapatan/${auth.uid}`);
      this.jumlahKeuntunganRef$ = this.database.object(`jumlah-keuntungan/${auth.uid}`);
      
      this.historiJumlahRef = this.database.list(`histori-jumlah/${auth.uid}`);
      this.historiKeuntunganRef = this.database.list(`histori-keuntungan/${auth.uid}`);
      this.saldoSubcription = 
      this.saldoItemRef.subscribe(
      saldoItem => this.saldoItem = saldoItem);
      this.jumlahpengeluaransubcription = 
      this.jumlahPengeluaranRef$.subscribe(
      jumlahPengeluaran => this.jumlahPengeluaran = jumlahPengeluaran);
      this.jumlahpensubcription = 
      this.jumlahPendapatanRef$.subscribe(
      jumlahPen => this.jumlahPen = jumlahPen);
      this.jumlahKeuntunganSub = this.jumlahKeuntunganRef$.subscribe(
      jumlahKeuntungan => this.jumlahKeuntungan = jumlahKeuntungan);
     });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPengeluaranPage');
  }
  
  
  ionViewWillUnload() {
    this.jumlahpengeluaransubcription.unsubscribe();
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

  public notify() {
    if (this.isToggled==false){
      this.nmbrg1=1;
      this.nmbrg2=0;
      this.pengeluaranItem.status = 0;
    } 
    else{
      this.nmbrg1=0;
      this.nmbrg2=1;
      this.pengeluaranItem.barang="";
      this.pengeluaranItem.status = 1;
    }
  }
  public notify2() {
    if (this.isToggled2==false){
      this.stn1=1;
      this.stn2=0;
      this.pengeluaranItem.status2 = 0;
    } 
    else{
      this.stn1=0;
      this.stn2=1;
      this.pengeluaranItem.satuan="";
      this.pengeluaranItem.status2 = 1;
    }
  }
  simpanPengeluaran(pengeluaranItem: PengeluaranItem) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
  
      setTimeout(() => {
        if(pengeluaranItem.biayaTambahan){
          this.pengeluaranItem.totalHarga = (Number(this.pengeluaranItem.harga) * Number(this.pengeluaranItem.jumlah)) + Number(this.pengeluaranItem.biayaTambahan);
          
        }else if(!this.pengeluaranItem.biayaTambahan){
          this.pengeluaranItem.totalHarga = Number(this.pengeluaranItem.harga) * Number(this.pengeluaranItem.jumlah);
             
        }
            
         
          if (this.saldoItem.saldo < this.pengeluaranItem.totalHarga) {
            loading.dismiss();
            this.toast.create({
            message: `Maaf uang anda tidak cukup`,
            duration : 3000
            }).present();
          } 
          else {
            this.pengeluaranItem.tanggal = moment().format();
            if (this.pengeluaranItem.note == null) {
              if(this.pengeluaranItem.biayaTambahan == null){
                
                this.pengeluaranRef.push({
                  bulanTahun: this.pengeluaranItem.bulanTahun,
                  tanggal: this.pengeluaranItem.tanggal,
                  barang: this.pengeluaranItem.barang,
                  satuan: this.pengeluaranItem.satuan,
                  harga: Number(this.pengeluaranItem.harga),
                  jumlah: Number(this.pengeluaranItem.jumlah),
                  status: this.pengeluaranItem.status,
                  status2: this.pengeluaranItem.status2,
                  totalHarga: Number(this.pengeluaranItem.totalHarga),
                  
                  
                });
              }else{
                this.pengeluaranRef.push({
                  bulanTahun: this.pengeluaranItem.bulanTahun,
                  tanggal: this.pengeluaranItem.tanggal,
                  barang: this.pengeluaranItem.barang,
                  satuan: this.pengeluaranItem.satuan,
                  harga: Number(this.pengeluaranItem.harga),
                  jumlah: Number(this.pengeluaranItem.jumlah),
                  totalHarga: Number(this.pengeluaranItem.totalHarga),
                  status: this.pengeluaranItem.status,
                  status2: this.pengeluaranItem.status2,
                  biayaTambahan: Number(this.pengeluaranItem.biayaTambahan)
                });
              }
               
            }
            else {
              if(this.pengeluaranItem.biayaTambahan == null){

                this.pengeluaranRef.push({
                  bulanTahun: this.pengeluaranItem.bulanTahun,
                  tanggal: this.pengeluaranItem.tanggal,
                  barang: this.pengeluaranItem.barang,
                  satuan: this.pengeluaranItem.satuan,
                  harga: Number(this.pengeluaranItem.harga),
                  jumlah: Number(this.pengeluaranItem.jumlah),
                  totalHarga: Number(this.pengeluaranItem.totalHarga),
                  status: this.pengeluaranItem.status,
                  status2: this.pengeluaranItem.status2,
                  note: this.pengeluaranItem.note
                  
                });
              }
              else{
                this.pengeluaranRef.push({
                  bulanTahun: this.pengeluaranItem.bulanTahun,
                  tanggal: this.pengeluaranItem.tanggal,
                  barang: this.pengeluaranItem.barang,
                  satuan: this.pengeluaranItem.satuan,
                  harga: Number(this.pengeluaranItem.harga),
                  jumlah: Number(this.pengeluaranItem.jumlah),
                  totalHarga: Number(this.pengeluaranItem.totalHarga),
                  status: this.pengeluaranItem.status,
                  status2: this.pengeluaranItem.status2,
                  note: this.pengeluaranItem.note,
                  biayaTambahan: Number(this.pengeluaranItem.biayaTambahan)
                });
              }
              
            }
            
            this.saldoItem.saldo = Number(this.saldoItem.saldo) - Number(this.pengeluaranItem.totalHarga);
            
            this.saldoItemRef.set({
              saldo : Number(this.saldoItem.saldo)
              
            })
            if (this.jumlahPengeluaran.totalPengeluaran == null || !this.jumlahPengeluaran.totalPengeluaran){
                this.jumlahPengeluaran.bulanTahun = this.pengeluaranItem.bulanTahun;
                this.jumlahPengeluaran.totalPengeluaran = this.pengeluaranItem.totalHarga;
                this.jumlahPengeluaranRef$.set({
                totalPengeluaran: Number(this.jumlahPengeluaran.totalPengeluaran),
                bulanTahun: this.jumlahPengeluaran.bulanTahun
                })
              }
           
            else {
                if (this.pengeluaranItem.bulanTahun == this.jumlahPengeluaran.bulanTahun){
                  this.jumlahPengeluaran.totalPengeluaran = Number(this.jumlahPengeluaran.totalPengeluaran) + Number(this.pengeluaranItem.totalHarga);
                  this.jumlahPengeluaranRef$.update(this.jumlahPengeluaran);
                
                }
                else{
                  this.historiPengeluaran.historiBulanTahun = this.jumlahPengeluaran.bulanTahun;
                  this.historiPengeluaran.historiPengeluran = this.jumlahPengeluaran.totalPengeluaran;
                  this.historiPengeluaranRef.push({
                  historiBulanTahun: this.historiPengeluaran.historiBulanTahun,
                  historiPengeluran: this.historiPengeluaran.historiPengeluran
                  });

                  this.jumlahPengeluaran.bulanTahun = this.pengeluaranItem.bulanTahun;
                  this.jumlahPengeluaran.totalPengeluaran = this.pengeluaranItem.totalHarga;
                  this.jumlahPengeluaranRef$.set({
                  totalPengeluaran: Number(this.jumlahPengeluaran.totalPengeluaran),
                  bulanTahun: this.jumlahPengeluaran.bulanTahun
                  })
               
                }
              }
            loading.dismiss();
            this.toast.create({
            message: `Berhasil Menyimpan`,
            duration : 3000
            }).present();
            this.pengeluaranItem = {} as PengeluaranItem;
            this.navCtrl.pop();
          
          } 
          
          
    
      
      }, 1000);
 
  }
}
