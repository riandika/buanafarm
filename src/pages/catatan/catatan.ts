import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, AlertController } from 'ionic-angular';
import { AddCatatanPage } from '../add-catatan/add-catatan';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database-deprecated';
import { CatatanItem } from '../../models/catatan/catatan-item';
import { AngularFireAuth } from 'angularfire2/auth';
import { EditCatatanPage } from '../edit-catatan/edit-catatan';



@Component({
  selector: 'page-catatan',
  templateUrl: 'catatan.html',
})
export class CatatanPage {
  
  catatanListRef: FirebaseListObservable<CatatanItem[]>;
  
  catatanItem = {} as CatatanItem;
  
  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public alertCtrl: AlertController, private database: AngularFireDatabase, private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    
    this.afAuth.authState.subscribe(auth => {
      
      this.catatanListRef = this.database.list(`catatan-list/${auth.uid}`);  
      
  
     });

    
    
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CatatanPage');
  }
  ionViewWillUnload() {
    this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
  }
  addcatatan() {
    this.navCtrl.push(AddCatatanPage);
  }
  hapus(catatanItem: CatatanItem){
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
            this.catatanListRef.remove(catatanItem.$key);
              
          }
        }
      ]
    });
    confirm.present();
  }
  ubah(catatanItem : CatatanItem) {
    this.navCtrl.push(EditCatatanPage, 
      { catatanItemId: catatanItem.$key});
    
  }

}
