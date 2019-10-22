import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ActionSheetController, LoadingController } from 'ionic-angular';

import * as moment from 'moment';
import { FirebaseListObservable, AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { StockItem } from '../../models/stock-item/stock-item.interface';
import { AngularFireAuth } from 'angularfire2/auth';
import { JobListItem } from '../../models/joblist-item/joblist-item';
import { Subscription } from 'rxjs/Subscription';
import { Status } from '../../models/status';


/**
 * Generated class for the AddJobListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-job-list',
  templateUrl: 'add-job-list.html',
})
export class AddJobListPage {
  
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

  stockItemSubcription: Subscription;
  statusItemSubcription: Subscription;
  stockItemRef$: FirebaseObjectObservable<StockItem>;
  stockItemId;
  
  public userID;
  
  constructor(public loadingCtrl: LoadingController, private actionSheetCtrl: ActionSheetController, private afAuth: AngularFireAuth, private toast: ToastController, private database: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
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
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddJobListPage');
  }
  ionViewWillLeave() {
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
          this.navCtrl.push(AddJobListPage, {stockItemId: stockItem.$key}).then(() => {
            
            const index = this.navCtrl.getActive().index;
            this.navCtrl.remove(index-1);
           
           
            
            
            //this.navCtrl.remove(index-2);
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
  
  simpanJob(joblistItem: JobListItem) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
      });
      loading.present();
      
  
      setTimeout(() => {
        
            if (this.statusItem.status == 0){
              
             
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
              loading.dismiss();
              this.toast.create({
              message: `Berhasil Menyimpan`,
              duration : 2000,
              
              }).present();
            }
            else{
              
              this.joblistItem.bahan = this.stockItem.namaBrg;
              this.joblistItem.notebahan = this.stockItem.note;
              this.joblistItem.satuan = this.stockItem.satuan;
              this.stockItem.jumlahBrg = this.stockItem.jumlahBrg - this.joblistItem.jumlah;
              this.stockItemRef$.update(this.stockItem);
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
            
            
            this.joblistItem = {} as JobListItem;
            this.navCtrl.pop();
      }, 1000);
 
  }
  

}
