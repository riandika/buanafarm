import { Profile } from './../../models/profile';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';











/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/co mponents/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile = {} as Profile;
  profileRef$: FirebaseObjectObservable<Profile>

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, private toast: ToastController, private afDatabase: AngularFireDatabase, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
    this.afAuth.authState.subscribe(auth => {
          
      this.profileRef$ =  this.afDatabase.object(`profile/${auth.uid}`);
      
      });
  }


   
  ionViewWillUnload() {
    this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
  }
  

  createProfile(profile: Profile) {

    let loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: 'Mohon Tunggu...'
    });
    loading.present();
    

    setTimeout(() => {
      

      
      //try {
        if (this.profile.namaKebun == null || this.profile.nama == null || this.profile.alamat == null)
        {
          
          loading.dismiss();
          this.toast.create({
            message: 'Harap Di Isi',
            duration : 3000
            }).present(); 
        
        }
         
        else {

        
          
            this.profileRef$.set({

          
              namaKebun: this.profile.namaKebun,
              nama: this.profile.nama,
              alamat: this.profile.alamat
            
              
            });
            
            
              this.profile = {} as Profile;
              loading.dismiss();
              this.toast.create({
              message: `Berhasil Membuat Akun`,
              duration : 3000
              }).present()
              
              
            this.navCtrl.setRoot(HomePage);
          

          
        }

            
          //}
        
        
        
       
        
      //catch (e) {
      //  loading.dismiss();
        
    //}
        
        
    
    }, 1000);
    
    
  }

}
