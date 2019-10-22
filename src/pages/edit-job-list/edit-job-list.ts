
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';

import * as moment from 'moment';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { StockItem } from '../../models/stock-item/stock-item.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { JobListItem } from '../../models/joblist-item/joblist-item';
import { Subscription } from 'rxjs/Subscription';
import { Status } from '../../models/status';




@Component({
  selector: 'page-edit-job-list',
  templateUrl: 'edit-job-list.html',
})
export class EditJobListPage {
  nohapus : number = 0;
  jumlah;
  list1: any;
  list2: any;
  list3: any;
  namabrg;
  jumbrg;
  satuanbrg;
  notebrg;
 
  statusRef: FirebaseObjectObservable<Status>;
  
  statusItem = {} as Status
  
  
  stockListRef: FirebaseListObservable<StockItem[]>;
  jobListRef: FirebaseListObservable<JobListItem[]>;
  stockItem = {} as StockItem;
  joblistItem = {} as JobListItem;
  jobItemSubcription: Subscription;
  stockItemSubcription: Subscription;
  statusItemSubcription: Subscription;
  stockItemRef$: FirebaseObjectObservable<StockItem>;
  jobItemRef$: FirebaseObjectObservable<JobListItem>;
  stockItemId;
  jobItemId;
  public userID;
  
  constructor(public alertCtrl: AlertController, public loadingCtrl: LoadingController, private actionSheetCtrl: ActionSheetController, private afAuth: AngularFireAuth, private toast: ToastController, private database: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.namabrg = this.stockItem.namaBrg;
    this.jumbrg = this.stockItem.jumlahBrg;
    this.satuanbrg= this.stockItem.satuan;
    this.notebrg = this.stockItem.note;

    
    this.joblistItem.tanggal = moment().format();
    
    this.list1 = 1;
    //this.statusItem.status;
    this.afAuth.authState.subscribe(auth => {
      this.statusRef = this.database.object(`status-list/${auth.uid}`);
      this.statusItemSubcription = 
      this.statusRef.subscribe(
      statusItem => this.statusItem = statusItem);
      
     });

    this.afAuth.authState.subscribe(auth => {
     
   
      this.stockListRef = this.database.list(`stock-list/${auth.uid}`);  
      this.jobListRef = this.database.list(`job-list/${auth.uid}`);
      
    });
    const stockItemId = this.navParams.get('stockItemId');
      this.afAuth.authState.subscribe(user => {
        if (user) {this.userID = user.uid}
        this.stockItemRef$ = this.database.object(`stock-list/${user.uid}/${stockItemId}`);
      
      this.stockItemSubcription = 
      this.stockItemRef$.subscribe(
      stockItem => this.stockItem = stockItem);
    
      });

      const jobItemId = this.navParams.get('jobItemId');
      this.afAuth.authState.subscribe(user => {
        if (user) {this.userID = user.uid}
        this.jobItemRef$ = this.database.object(`job-list/${user.uid}/${jobItemId}`);
      
      this.jobItemSubcription = 
      this.jobItemRef$.subscribe(
      joblistItem => this.joblistItem = joblistItem);
    
      });

  }
  
  ionViewDidLoad() {
    this.nohapus = 0;
    console.log('ionViewDidLoad AddJobListPage');
  }
  ionViewWillLeave() {
    if (this.nohapus == 1) {
      this.jobItemRef$.remove();
    }
    this.stockItemSubcription.unsubscribe();
    this.statusItemSubcription.unsubscribe();
  }
  selectStockItem(stockItem: StockItem) {
    this.actionSheetCtrl.create({
      title: `${stockItem.namaBrg}`,
      buttons: [
      {
        text: 'Pilih',
        handler: () => {
          
          this.statusItem.status = 1;
          
          this.statusRef.set({
            status: this.statusItem.status
          })
          this.navCtrl.push(EditJobListPage, {stockItemId: stockItem.$key, jobItemId: this.joblistItem.$key}).then(() => {
            
          const index = this.navCtrl.getActive().index;
          this.navCtrl.remove(index-1);
          
       });
          
           //this.navCtrl.push(AddJobListPage, {stockItemId: stockItem.$key});
           
            
            

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

  pilih() {
    //this.isistatus = 1;
    
    this.list1= 0;
    this.list2 = 1;
    this.list3 = 0;
    
    
  }
  statusubah() {
    let confirm = this.alertCtrl.create({
      title: 'Ubah Data Tambahan',
      message: 'Data akan terhapus dan tidak bisa dikembalikan!',
      buttons: [
        {
          text: 'Batal',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Oke',
          handler: () => {
            console.log('Agree clicked');
            this.toast.create({
              message: `Berhasil, Silahkan pilih stok barang lainnya`,
              duration : 3000,
              }).present();

              
              
              /*
                if (this.joblistItem.notebahan == null){
                  
                  this.stockItem.namaBrg = this.joblistItem.bahan;
                  this.stockItem.jumlahBrg = this.joblistItem.jumlah;
                  this.stockItem.satuan = this.joblistItem.satuan;
                  this.stockItem.note = null;
                  this.stockItemRef$.update(this.stockItem);
                  
                
                }else if(this.joblistItem.notebahan != null){
                  
                  this.stockItem.namaBrg = this.joblistItem.bahan;
                  this.stockItem.jumlahBrg = this.joblistItem.jumlah;
                  this.stockItem.satuan = this.joblistItem.satuan;
                  this.stockItem.note = this.joblistItem.notebahan;
                  this.stockItemRef$.update(this.stockItem);
                }*/
               
             
             
              
              this.joblistItem.bahan = null;
              this.joblistItem.jumlah = null;
              this.joblistItem.satuan= null;
              this.joblistItem.notebahan= null;
              this.jobItemRef$.update(this.joblistItem);
              this.list1= 0;
              this.list2 = 1;
              this.list3 = 0;
          }
        }
      ]
    });
    confirm.present();
  }
  close() {
    
    this.list1=1;
    this.list2=0;
    this.list3 = 0;
    
    
  }
 
  batal(){
    this.statusItem.status = 0;
          
          this.statusRef.set({
            status: this.statusItem.status
          })
  }
  
  simpanJob(joblistItem: any) {
    this.nohapus = 1;
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
      });
      loading.present();
      
  
      setTimeout(() => {
            //this.joblistItem.tanggal = moment().format();
            if (this.statusItem.status == 0 && this.joblistItem.bahan != null) {
              loading.dismiss();
              this.toast.create({
              message: `Berhasil Menyimpan`,
              duration : 2000,
              
              }).present();
              if (this.joblistItem.notebahan == null) {
                this.joblistItem.bahan = this.joblistItem.bahan;
               
                this.joblistItem.jumlah = this.joblistItem.jumlah;
                this.joblistItem.satuan = this.joblistItem.satuan;
              } else if ( this.joblistItem.notebahan != null) {
                this.joblistItem.bahan = this.joblistItem.bahan;
                this.joblistItem.notebahan = this.joblistItem.notebahan;
                this.joblistItem.jumlah = this.joblistItem.jumlah;
                this.joblistItem.satuan = this.joblistItem.satuan;
              }
              
              if (this.joblistItem.job == null && this.joblistItem.note == null)
              {
                if (this.joblistItem.notebahan == null) {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                   
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                   
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
               
              }else if (this.joblistItem.job == null ) {
                if (this.joblistItem.notebahan == null) {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                   
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                   
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
              }else if (this.joblistItem.note == null)
              {
                if (this.joblistItem.notebahan == null) {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                   
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                   
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
              }
              else {
                if (this.joblistItem.notebahan == null) {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                   
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                   
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
                
              }
              
            }
            else if (this.statusItem.status == 0){
              
              
             
              loading.dismiss();
              this.toast.create({
              message: `Berhasil Menyimpan`,
              duration : 2000,
              
              }).present();
              

              if (this.joblistItem.job == null && this.joblistItem.note == null)
              {
                this.jobListRef.push({
                  tanggal: this.joblistItem.tanggal,
                  
                });
               
              }else if (this.joblistItem.job == null ) {
                this.jobListRef.push({
                  tanggal: this.joblistItem.tanggal,
                  
                  note: this.joblistItem.note
                });
              }else if (this.joblistItem.note == null)
              {
                this.jobListRef.push({
                  tanggal: this.joblistItem.tanggal,
                  
                  job: this.joblistItem.job
                });
              }
              else {
                this.jobListRef.push({
                  tanggal: this.joblistItem.tanggal,
                 
                  job: this.joblistItem.job,
                  note: this.joblistItem.note
                });
                
              }
              

              
            }
            else{
                  
                  
              if (this.stockItem.note == null){
                
                this.joblistItem.bahan = this.stockItem.namaBrg;
                this.joblistItem.notebahan = null;
                this.joblistItem.satuan = this.stockItem.satuan;
                this.stockItem.jumlahBrg = this.stockItem.jumlahBrg - this.joblistItem.jumlah;
                this.stockItemRef$.update(this.stockItem);
              }else if(this.stockItem.note != null) {
               
                this.joblistItem.bahan = this.stockItem.namaBrg;
                this.joblistItem.notebahan = this.stockItem.note;
                this.joblistItem.satuan = this.stockItem.satuan;
                this.stockItem.jumlahBrg = this.stockItem.jumlahBrg - this.joblistItem.jumlah;
                this.stockItemRef$.update(this.stockItem);
              }
              
              if (this.stockItem.jumlahBrg == 0 ){
                this.stockListRef.remove(this.stockItem.$key);
               
                loading.dismiss();
                this.toast.create({
                message: `Berhasil, Stock ${joblistItem.bahan} sudah habis`,
                duration : 3000,
                
                }).present();
            
               
              }else if(this.stockItem.jumlahBrg > 0) {
                loading.dismiss();
                this.toast.create({
                  message: `Berhasil, Stock ${this.stockItem.namaBrg} sisa ${this.stockItem.jumlahBrg} ${this.stockItem.satuan}`,
                  duration : 3000,
                  
                  }).present();
              }
              //this.jobItemRef$.update(joblistItem);
             
              if (this.joblistItem.job == null && this.joblistItem.note == null)
              {
                if (this.joblistItem.notebahan == null){
                  this.jobListRef.push({

                    tanggal: this.joblistItem.tanggal,
                    
                    bahan: this.joblistItem.bahan,
                    
                    jumlah: this.joblistItem.jumlah,
                    satuan: this.joblistItem.satuan
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: this.joblistItem.jumlah,
                    satuan: this.joblistItem.satuan
                  });
                }
                
                
               
              }else if (this.joblistItem.job == null ) {
                if (this.joblistItem.notebahan == null){
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    bahan: this.joblistItem.bahan,
                    
                    jumlah: this.joblistItem.jumlah,
                    satuan: this.joblistItem.satuan,
                    note: this.joblistItem.note
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: this.joblistItem.jumlah,
                    satuan: this.joblistItem.satuan,
                    note: this.joblistItem.note
                  });
                }
                
              }else if (this.joblistItem.note == null)
              {
                if (joblistItem.notebahan == null) {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    bahan: this.joblistItem.bahan,
                    
                    jumlah: this.joblistItem.jumlah,
                    job: this.joblistItem.job,
                    satuan: this.joblistItem.satuan
                  });
                }
                else{
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                   
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: this.joblistItem.jumlah,
                    job: this.joblistItem.job,
                    satuan: this.joblistItem.satuan
                  });
                }
               
              }
              else {
                
                if (joblistItem.notebahan == null) {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                   
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                   
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
                else {
                  this.jobListRef.push({
                    tanggal: this.joblistItem.tanggal,
                    
                    job: this.joblistItem.job,
                    bahan: this.joblistItem.bahan,
                    notebahan: this.joblistItem.notebahan,
                    jumlah: Number(this.joblistItem.jumlah),
                    note: this.joblistItem.note,
                    satuan: this.joblistItem.satuan
                  });
                }
               
                }
              }
              
           
            this.navCtrl.pop();
      }, 1000);
 
  }
  

}
