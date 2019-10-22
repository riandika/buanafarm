import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { AddJobListPage } from '../add-job-list/add-job-list';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Status } from '../../models/status';
import { JobListItem } from '../../models/joblist-item/joblist-item';
import { EditJobListPage } from '../edit-job-list/edit-job-list';

/**
 * Generated class for the JobListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-job-list',
  templateUrl: 'job-list.html',
})
export class JobListPage {
  

  
  statusRef: FirebaseObjectObservable<Status>;
  statusItem = {} as Status
  jobListRef: FirebaseListObservable<JobListItem[]>;
  joblistItem = {} as JobListItem;
  

  constructor(public alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController,  private toast: ToastController, private afAuth: AngularFireAuth, private database: AngularFireDatabase, private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    //this.statusItem.status = this.isistatus;
    this.afAuth.authState.subscribe(auth => {
      this.statusRef = this.database.object(`status-list/${auth.uid}`);
      
      
     });

     this.afAuth.authState.subscribe(auth => {  
      this.jobListRef = this.database.list(`job-list/${auth.uid}`);
      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobListPage');
  }
  ionViewWillUnload() {
    this.menuCtrl.swipeEnable( true );
    this.menuCtrl.enable (true, 'myMenu');
  }
  addJob(statusItem : Status) {
    //statusItem.status = this.isistatus;
    //this.isistatus = 0;
    this.statusItem.status = 0;
    this.statusRef.set({
      status: statusItem.status
    })
    this.navCtrl.push(AddJobListPage);
  }
  selectStockItem(joblistItem: JobListItem) {
    this.actionSheetCtrl.create({
      title: `${joblistItem.job}`,
      buttons: [
      {
        text: 'Ubah',
        handler: () => {
          this.statusItem.status = 0;
          this.statusRef.set({
            status: this.statusItem.status
          })
          this.navCtrl.push(EditJobListPage, 
          { jobItemId: joblistItem.$key});
         
        }
      },
      {
        text: 'Hapus',
        role: 'destructive',
        handler: () => {
          
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
                  this.jobListRef.remove(joblistItem.$key);
                }
              }
            ]
          });
          confirm.present();
          
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
  
}
