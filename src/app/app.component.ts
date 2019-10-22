import { Component } from '@angular/core';
import { Platform, ToastController, LoadingController, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { timer } from 'rxjs/observable/timer';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { UbahAkunPage } from '../pages/ubah-akun/ubah-akun';
import { ProfilePage } from '../pages/profile/profile';
import { Subscription } from 'rxjs/Subscription';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any;

  showSplash = true;

  profileSubcription: Subscription;
  profiledataRef$: FirebaseObjectObservable<Profile>;
  profile = {} as Profile;
  nama: number = 0;
 
  constructor(public menuCtrl: MenuController, private screenOrientation: ScreenOrientation, private toast: ToastController, public loadingCtrl: LoadingController, private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,  public app: App) {
   // this.jumlahKeuntungan.totalKeuntungan = Number(this.jumlahPen.totalPendapatan) - Number(this.jumlahPengeluaran.totalPengeluaran);
      
   
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      timer(1000).subscribe(() => this.showSplash = false)
    });
   
     

    const authObserver = afAuth.authState.subscribe(data => {
      if (data) {
        this.rootPage = HomePage;
        
        authObserver.unsubscribe();
      }
      else {
        this.rootPage = LoginPage;
        authObserver.unsubscribe();
        
        
      }
    });
    
  
    
    this.afAuth.authState.subscribe(data => {
    	if (data && data.email && data.uid) {
        this.profiledataRef$ = this.afDatabase.object(`profile/${data.uid}`);
        this.profileSubcription = 
      this.profiledataRef$.subscribe(
      profile => this.profile = profile);
        }    	
    });
    this.afAuth.authState.subscribe(auth => {
      this.profiledataRef$ = this.afDatabase.object(`profile/${auth.uid}`);
      this.profileSubcription = 
      this.profiledataRef$.subscribe(
      profile => this.profile = profile);
       
      });
  }
  set() {
    if(!this.profile.nama){
      this.app.getActiveNav().push(ProfilePage);
    }else if(this.profile.nama){
      this.app.getActiveNav().push(UbahAkunPage);
    }
    
    
    
  }
  buat(){
    this.app.getActiveNav().setRoot(ProfilePage);
  }
  logout() {
    
    let loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: 'Mohon Tunggu...'
    });
    loading.present();
    

    setTimeout(() => {
      loading.dismiss();
      
      this.afAuth.auth.signOut();
      this.toast.create({

        message: `Berhasil Log Out`,
        duration: 2000
        }).present();
    
    console.log("user is log out");
    this.screenOrientation.unlock();
    this.app.getActiveNav().setRoot(LoginPage);
    
    }, 2000);


    
    //this.navCtrl.setRoot('LoginPage');

  }



}

