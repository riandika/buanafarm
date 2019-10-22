import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { CatatanItem } from '../../models/catatan/catatan-item';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
/**
 * Generated class for the AddCatatanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-catatan',
  templateUrl: 'add-catatan.html',
})
export class AddCatatanPage {

  currentdate;
  formatedDate;
  catatanItem = {} as CatatanItem;
  catatanItemRef$: FirebaseListObservable<CatatanItem[]>

  constructor(private database: AngularFireDatabase, private toast: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    this.catatanItem.currentdate = this.getFormatedDate();

    this.afAuth.authState.subscribe(auth => {
      this.catatanItemRef$ = this.database.list(`catatan-list/${auth.uid}`);
      
      
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
    

    //var montArray = ['01','02', '03','04','05','06','07','08','09','10','11','12']
   
    //this.formatedDate = date + '/' + montArray[mont] + '/' + year + ' ' + time+':'+Menit+':'+detik
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCatatanPage');
  }
  protected adjustTextarea(event: any): void {
    let textarea: any		= event.target;
    
      textarea.style.height 	= 'auto';
      textarea.style.height 	= textarea.scrollHeight + 'px';
      textarea.style.overflow = 'hidden';
  
    return;
  }

  simpan(catatanItem: CatatanItem){
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      
      setTimeout(() => {
        this.catatanItem.currentdate = moment().format();
        
         if (this.catatanItem.catatan == null )
         {
          this.catatanItemRef$.push({
    
          
            currentdate: this.catatanItem.currentdate
            
            
          });
          loading.dismiss();
          this.toast.create({
          message: `Berhasil Menyimpan`,
          duration : 3000
          }).present();
          this.catatanItem = {} as CatatanItem;
          this.navCtrl.pop();
         }else {
          this.catatanItemRef$.push({
    
            catatan: this.catatanItem.catatan,
            currentdate: this.catatanItem.currentdate
            
            
          });
          loading.dismiss();
          this.toast.create({
          message: `Berhasil Menyimpan`,
          duration : 3000
          }).present();
          this.catatanItem = {} as CatatanItem;
          this.navCtrl.pop();
         }
          
         
        
      }, 1000);
  }
 


}
