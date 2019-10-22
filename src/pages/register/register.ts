import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
import { LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

  
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	user = {} as User;

  constructor(private afAuth: AngularFireAuth, private toast: ToastController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams) {
  }


  async register(user: User) {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Mohon Tunggu...'
      });
      loading.present();
      setTimeout(async () => {
        
        try {
          const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
          //console.log(result);
          if (result) {
            
            loading.dismiss();
            
            
            
            
              this.toast.create({
                message: `Isi Profile Anda dengan Benar!`,
                duration : 4000
                }).present();
              this.navCtrl.setRoot(ProfilePage);
              
                             
           
    
            
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
                message: `Format email salah`,
              duration : 3000
              }).present();
          }
         
          
        }
      }, 500);
    


  	
  }

}
