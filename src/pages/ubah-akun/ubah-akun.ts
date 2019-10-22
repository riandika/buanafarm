import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from '../../models/profile';

/**
 * Generated class for the UbahAkunPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ubah-akun',
  templateUrl: 'ubah-akun.html',
})
export class UbahAkunPage {

  profileSubcription: Subscription;
  profileRef$: FirebaseObjectObservable<Profile>;
  profile = {} as Profile;
  
  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public loadingCtrl: LoadingController, private database: AngularFireDatabase , public menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    
      this.afAuth.authState.subscribe(user => {
        
        this.profileRef$ = this.database.object(`profile/${user.uid}`);
      
      this.profileSubcription = 
      this.profileRef$.subscribe(
      profile => this.profile = profile);
    
      });
  
  }


  ionViewWillUnload() {
    this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UbahAkunPage');
  }

  editProfile(profile : any) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
      });
      loading.present();
      
  
      setTimeout(() => {
        

        loading.dismiss();
        this.toast.create({
      message: `Berhasil Menyimpan`,
      duration : 3000
      }).present();
      this.profileRef$.update(profile);

      this.navCtrl.pop();
      
      
      }, 1000);
    
  }
  ionViewWillLeave() {
    this.profileSubcription.unsubscribe();
  }
}
