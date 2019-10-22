import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController, AlertController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
import { LoadingController } from 'ionic-angular';

import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';



/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  


  

	user = {} as User;
  

  constructor(private alertCtrl: AlertController, public menuCtrl: MenuController, private afAuth: AngularFireAuth, private toast: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
   
    this.menuCtrl.enable(false, 'myMenu');
    this.menuCtrl.swipeEnable( false );
  }


  
  

  async login(user: User) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
     content: 'Mohon Tunggu...'
     });
     loading.present();
     setTimeout( async () => {
      
     try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      
      if (result) {
       
        
        loading.dismiss();
          this.afAuth.authState.subscribe(data => {
      
        
        this.toast.create({
        message: `Selamat Datang, ${data.email}`,
        duration: 3000
        }).present();       
      
       });
          
        this.navCtrl.setRoot(HomePage);
        
        


      }
      

   }
    catch {
      
      
     if(user.password.length < 6){
        loading.dismiss();
        
       this.toast.create({
            message: `Password Minimal 6 Karakter`,
          duration : 3000
          }).present();
      }
      
      else{
        loading.dismiss();
        
       this.toast.create({
            message: `Email atau password salah`,
          duration : 3000
          }).present();
      }
     

    }


    }, 1000);
    

  }

  reset() {
    let promt = this.alertCtrl.create({
      title: 'Masukan Email',
      message: "Password baru akan di kirim ke email",
      inputs: [{
        name: 'recoveryemail',
        placeholder:'email@contoh.com'
      }],
      buttons: [{
        text: 'Batal',
        handler: data => {
          console.log('Cancel Clicked');
        }
      },
      {
        text: 'Kirim',
        handler: data => {
          let loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
            content: 'Sedang Mereset..'
          });
          loading.present();
          this.afAuth.auth.sendPasswordResetEmail(data.recoveryemail).then(() =>{
            loading.dismiss().then (() => {
              let alert = this.alertCtrl.create({
                title: 'Check Email',
                subTitle: 'Password telah berhasil di reset',
                buttons: ['OK']
              });
              alert.present();
            })
            
          
          }, error => {
            loading.dismiss().then (() => {
              let alert = this.alertCtrl.create({
                title: 'Terjadi Kelasahan Resetting Password',
                subTitle: error.message,
                buttons: ['OK']
              });
              alert.present();
            })
          });
        }
        
      }
    ]
    });
    promt.present();
  }

  register() {
    
  	this.navCtrl.push(RegisterPage);
  }

  
}
