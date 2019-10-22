import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { AddPendapatanPage } from '../add-pendapatan/add-pendapatan';
import { AddPengeluaranPage } from '../add-pengeluaran/add-pengeluaran';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { PendapatanItem } from '../../models/pendapatan/pendapatan-list';
import { PengeluaranItem } from '../../models/pengeluaran/pengeluaran-list';
import { AngularFireAuth } from 'angularfire2/auth';
import { EditPendapatanPage } from '../edit-pendapatan/edit-pendapatan';
import { EditPengeluaranPage } from '../edit-pengeluaran/edit-pengeluaran';
import { JumlahPendapatan } from '../../models/keuangan/jumlah-pendapatan';
import { Subscription } from 'rxjs/Subscription';
import { HistoriPengeluaran } from '../../models/keuangan/histori-pengeluaran';
import { HistoriJumlah } from '../../models/keuangan/histori-jumlah';
import { JumlahPengeluaran } from '../../models/keuangan/jumlah-pengeluaran';
import { JumlahKeuntungan } from '../../models/keuangan/keuntungan';
import { HistoriKeuntungan } from '../../models/keuangan/histori-keuntungan';
import { PengambilanList } from '../../models/pengambilan/ambil-list';
import { SaldoItem } from '../../models/saldo/saldo-item';
import * as moment from 'moment';
/**
 * Generated class for the KeuanganPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-keuangan',
  templateUrl: 'keuangan.html',
})
export class KeuanganPage {
  pendapatanRef: FirebaseListObservable<PendapatanItem[]>;
  pendapatanItem = {} as PendapatanItem;
  pengeluaranRef: FirebaseListObservable<PengeluaranItem[]>;
  pengeluaranItem = {} as PengeluaranItem;
  listkeuangan: string;
  noambil: number;
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  bulantahunskrg;
  bulantahun;
  /*untuk pengambilan */
  pengambilanListRef: FirebaseListObservable<PengambilanList[]>;
  saldoItemRef: FirebaseObjectObservable<SaldoItem>;
  saldoSubcription : Subscription;
  saldoItem = {} as SaldoItem;
  pengambilanList = {} as PengambilanList;
  //formatedDate;
  /*pendapatan, pengeluaran, dan keuntungan*/
  jumlahPendapatanRef$: FirebaseObjectObservable<JumlahPendapatan>;
  jumlahpensubcription: Subscription;
  jumlahPen = {} as JumlahPendapatan;
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
  constructor(public loadingCtrl: LoadingController, private toast: ToastController, public alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController, private database: AngularFireDatabase, private afAuth: AngularFireAuth,  private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
   
    this.bulantahunskrg = this.getFormatedDate();
    this.afAuth.authState.subscribe(auth => {
      this.pengeluaranRef = this.database.list(`pengeluaran-list/${auth.uid}`);
      this.pendapatanRef = this.database.list(`pendapatan-list/${auth.uid}`);
      this.jumlahPendapatanRef$ = this.database.object(`jumlah-pendapatan/${auth.uid}`);
      this.jumlahPengeluaranRef$ = this.database.object(`jumlah-pengeluaran/${auth.uid}`);
      this.jumlahKeuntunganRef$ = this.database.object(`jumlah-keuntungan/${auth.uid}`);
      this.historiPengeluaranRef = this.database.list(`histori-pengeluaran/${auth.uid}`);
      this.historiJumlahRef = this.database.list(`histori-jumlah/${auth.uid}`);
      this.historiKeuntunganRef = this.database.list(`histori-keuntungan/${auth.uid}`);
      this.pengambilanListRef = this.database.list(`pengambilan-list/${auth.uid}`);  
      this.saldoItemRef = this.database.object(`saldo-list/${auth.uid}`);
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
   
      this.listkeuangan="dapat";
  
    
    console.log('ionViewDidLoad KeuanganPage');
    
  }
  ionViewWillUnload() {
   
    this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
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
    //var date = dateObj.getDate().toString()
    //var time = dateObj.getHours().toString()
    //var Menit = dateObj.getMinutes().toString()
    //var detik = dateObj.getSeconds().toString()
    
    //var jamArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','00']
   //var menitArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    //'25','26', '27','28','29','30','31','32','33','34', '35','36','37','38','39','40','41','42','43','44','45','46','47', '48','49','50','51','52','53','54','55','56','57','58','59','60']
    //var tglArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    //'25','26', '27','28','29','30','31']
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
    
   // this.formatedDate = (tglArray[date]) + '/' + montArray[mont] + '/' + year + ' ' + jamArray[time] +':'+ menitArray[Menit]+':'+detik
    
    this.bulantahun = montArray[mont] + '/' + year
  }
  ambil(){
    if (!this.pengambilanList.nominal || this.pengambilanList.nominal <= 0) {
     
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

          if(this.saldoItem.saldo == 0 || this.saldoItem.saldo < this.pengambilanList.nominal){
            loading.dismiss();
            this.toast.create({
              
              message: `Maaf uang anda tidak cukup untuk diambil`,
              duration : 2000
              }).present();
          }else{
            this.pengambilanList.tanggal = moment().format();
            this.pengambilanListRef.push({
               
              nominal: Number(this.pengambilanList.nominal),
              tanggal: this.pengambilanList.tanggal
             });
          
          
          this.saldoItem.saldo = Number(this.saldoItem.saldo) - Number(this.pengambilanList.nominal);
          
          this.saldoItemRef.set({
            saldo : Number(this.saldoItem.saldo)
            
          })

          loading.dismiss();
          this.toast.create({
          message: `Berhasil Diambil`,
          duration : 3000
          }).present();
          this.pengambilanList = {} as PengambilanList;
          
         
          //this.navCtrl.push(this.navCtrl.getActive().component);
          //this.noambil = 1;
         this.pengambilanList.nominal = null;
        
          }
            
        }, 1000);
    }
  }
  tambah() {
    if (this.listkeuangan == "dapat") {
      this.navCtrl.push(AddPendapatanPage);
    }else {
      this.navCtrl.push(AddPengeluaranPage);
    }
    
  }
  isi(valString) {
    
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unisi(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR);

  }

  unisi(val) {
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
  
  selectPengeluaran(pengeluaranItem: PengeluaranItem) {
    this.actionSheetCtrl.create({
      title: `${pengeluaranItem.barang}`,
      buttons: [
      {
        text: 'Ubah',
        handler: () => {
          if(this.bulantahunskrg == pengeluaranItem.bulanTahun) {
            this.navCtrl.push(EditPengeluaranPage, 
              { pengeluaranItemId: pengeluaranItem.$key});
          }else {
            this.toast.create({
              message: `Maaf anda hanya bisa mengubah untuk bulan ini`,
              duration : 2000
              }).present();
          }
            
    
         
         
        }
      },
      {
        text: 'Hapus dari daftar',
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
                    this.pengeluaranRef.remove(pengeluaranItem.$key);
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
  selectPendapatan(pendapatanItem: PendapatanItem) {
    this.actionSheetCtrl.create({
      title: `${pendapatanItem.sumber}`,
      buttons: [
      {
        text: 'Ubah',
        handler: () => {
          if(this.bulantahunskrg == pendapatanItem.bulanTahun) {
            this.navCtrl.push(EditPendapatanPage, 
              { pendapatanItemId: pendapatanItem.$key});
          }else {
            this.toast.create({
              message: `Maaf anda hanya bisa mengubah untuk bulan ini`,
              duration : 2000
              }).present();
          }
         
          
         
        }
      },
      {
        text: 'Hapus dari daftar',
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
                    this.pendapatanRef.remove(pendapatanItem.$key);
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
  selectStockItem(pengambilanList : PengambilanList) {
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
          this.pengambilanListRef.remove(pengambilanList.$key);
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
