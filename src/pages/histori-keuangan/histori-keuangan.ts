import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { HistoriPengeluaran } from '../../models/keuangan/histori-pengeluaran';
import { HistoriJumlah } from '../../models/keuangan/histori-jumlah';
import { HistoriKeuntungan } from '../../models/keuangan/histori-keuntungan';
import { AngularFireAuth } from 'angularfire2/auth';
import { HistoriSisaUang } from '../../models/keuangan/histori-uang';

/**
 * Generated class for the HistoriKeuanganPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-histori-keuangan',
  templateUrl: 'histori-keuangan.html',
})
export class HistoriKeuanganPage {
  historiPengeluaranRef: FirebaseListObservable<HistoriPengeluaran[]>;
  historiPengeluaran={} as HistoriPengeluaran;
  historiJumlahRef: FirebaseListObservable<HistoriJumlah[]>;
  historiJumlah={} as HistoriJumlah;
  historiKeuntunganRef: FirebaseListObservable<HistoriKeuntungan[]>;
  historiKeuntungan = {} as HistoriKeuntungan;
  historiSisaUangRef: FirebaseListObservable<HistoriSisaUang[]>;
 historiSisaUang = {} as HistoriSisaUang;
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  bisahapus: number;
  constructor(private toast: ToastController, public alertCtrl: AlertController, private database: AngularFireDatabase, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.afAuth.authState.subscribe(auth => {
      this.historiPengeluaranRef = this.database.list(`histori-pengeluaran/${auth.uid}`);
      this.historiJumlahRef = this.database.list(`histori-jumlah/${auth.uid}`);
      this.historiKeuntunganRef = this.database.list(`histori-keuntungan/${auth.uid}`);
      this.historiSisaUangRef = this.database.list(`histori-sisauang/${auth.uid}`);
    });
   
    
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
  ionViewDidLoad() {
    this.historiJumlahRef.subscribe(data => {
      if(data.length == 0) {
        this.bisahapus =1;
      }
    })
    console.log('ionViewDidLoad HistoriKeuanganPage');
  }
  hapus(){
    
        
          let confirm = this.alertCtrl.create({
            title: 'Hapus Histori Bulanan',
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
                        message: `Histori telah dihapus`,
                        duration : 1000
                        }).present();
                        this.historiJumlahRef.remove(this.historiJumlah.$key);
                      this.historiPengeluaranRef.remove(this.historiPengeluaran.$key);
                      this.historiKeuntunganRef.remove(this.historiKeuntungan.$key);
                      this.historiSisaUangRef.remove(this.historiSisaUang.$key);
                    
                  
                  
                    
                 
      
                }
              }
            ]
          });
          confirm.present();
     
  }
}