import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { CatatanItem } from '../../models/catatan/catatan-item';
import { Subscription } from 'rxjs/Subscription';
import { FirebaseObjectObservable, AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
/**
 * Generated class for the EditCatatanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-catatan',
  templateUrl: 'edit-catatan.html',
})
export class EditCatatanPage {
  formatedDate;
  nohapus : number = 0;
  catatanItemSubcription: Subscription;
  catatanItemRef$: FirebaseObjectObservable<CatatanItem>;
  catatanItemRef: FirebaseListObservable<CatatanItem[]>;
  catatanItem = {} as CatatanItem;
  public userID;


  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public loadingCtrl: LoadingController, private database: AngularFireDatabase , public navCtrl: NavController, public navParams: NavParams) {
    
    this.getFormatedDate();
    const catatanItemId = this.navParams.get('catatanItemId');
      
      this.afAuth.authState.subscribe(user => {
        if (user) {this.userID = user.uid}
        this.catatanItemRef$ = this.database.object(`catatan-list/${user.uid}/${catatanItemId}`);
        this.catatanItemRef = this.database.list(`catatan-list/${user.uid}`);
       
      this.catatanItemSubcription = 
      this.catatanItemRef$.subscribe(
      catatanItem => this.catatanItem = catatanItem);
    
      });
  }

  getFormatedDate() {
    var dateObj = new Date();
    var year = dateObj.getFullYear().toString()
    var mont = dateObj.getMonth().toString()
    var date = dateObj.getDate().toString()
    var time = dateObj.getHours().toString()
    var Menit = dateObj.getMinutes().toString()
    var detik = dateObj.getSeconds().toString()
    var jamArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','00']
    var menitArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    '25','26', '27','28','29','30','31','32','33','34', '35','36','37','38','39','40','41','42','43','44','45','46','47', '48','49','50','51','52','53','54','55','56','57','58','59','60']
    var tglArray = ['00','01','02', '03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24',
    '25','26', '27','28','29','30','31']
    var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    this.formatedDate = (tglArray[date]) + '/' + montArray[mont] + '/' + year + ' ' + jamArray[time] +':'+ menitArray[Menit]+':'+detik
    
  }

  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    
      textarea.style.height 	= 'auto';
      textarea.style.height 	= textarea.scrollHeight + 'px';
      textarea.style.overflow = 'hidden';
  
    return;
  }
  ionViewDidLoad() {
    
    this.nohapus = 0;
    console.log('ionViewDidLoad EditCatatanPage');
  }

  simpan(catatanItem : any) {
    this.nohapus = 1;
    //this.catatanItemRef$.remove();
    this.catatanItem.currentdate = moment().format();
    
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
  
      setTimeout(() => {
        

        loading.dismiss();
        this.toast.create({
      message: `Berhasil Menyimpan`,
      duration : 3000
      }).present();
     // this.tanggal = this.catatanItem.currentdate;
      //this.isi = this.catatanItem.catatan;
      //this.catatanItemRef$.update(catatanItem);
      if (this.catatanItem.catatan == null )
         {
          //this.catatanItem.currentdate = this.tanggal;
          this.catatanItemRef.push({
    
          
            currentdate: this.catatanItem.currentdate
            
            
          });
          
          this.catatanItem = {} as CatatanItem;
          
         }else {
        // this.catatanItem.currentdate = this.tanggal;
        //this.catatanItem.catatan = this.isi;
          this.catatanItemRef.push({
    
            catatan: this.catatanItem.catatan,
            currentdate: this.catatanItem.currentdate
            
            
          });
          
          this.catatanItem = {} as CatatanItem;
        
         }
          
      
         
      this.navCtrl.pop();
      
      
      }, 1000);
    
  }
  ionViewWillLeave() {
    if (this.nohapus == 1) {
      this.catatanItemRef$.remove();
    }
    
    this.catatanItemSubcription.unsubscribe();
  }

}
