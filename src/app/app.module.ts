import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { StockListPage } from '../pages/stock-list/stock-list';
import { InputStockPage } from '../pages/input-stock/input-stock';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { EditStockPage } from '../pages/edit-stock/edit-stock';
import { UbahAkunPage } from '../pages/ubah-akun/ubah-akun';
import { CatatanPage } from '../pages/catatan/catatan';
import { AddCatatanPage } from '../pages/add-catatan/add-catatan';
import { EditCatatanPage } from '../pages/edit-catatan/edit-catatan';
import { AddJobListPage } from '../pages/add-job-list/add-job-list';
import { EditJobListPage } from '../pages/edit-job-list/edit-job-list';
import { JobListPage } from '../pages/job-list/job-list';
import { KeuanganPage } from '../pages/keuangan/keuangan';
import { AddPendapatanPage } from '../pages/add-pendapatan/add-pendapatan';
import { EditPendapatanPage } from '../pages/edit-pendapatan/edit-pendapatan';
import { AddPengeluaranPage } from '../pages/add-pengeluaran/add-pengeluaran';
import { EditPengeluaranPage } from '../pages/edit-pengeluaran/edit-pengeluaran';
import { DepositPage } from '../pages/deposit/deposit';
import { InfoAkunPage } from '../pages/info-akun/info-akun';
import { TarikKembaliPage } from '../pages/tarik-kembali/tarik-kembali';
import { HistoriKeuanganPage } from '../pages/histori-keuangan/histori-keuangan';

import * as firebase from 'firebase';



export const FirebaseAuth = {
  apiKey: "AIzaSyBkj9Vd4Fy0Ok7oMdNC6RqkqZLvsuV6rMg",
  authDomain: "fir-auth-af57d.firebaseapp.com",
  databaseURL: "https://fir-auth-af57d.firebaseio.com",
  projectId: "fir-auth-af57d",
  storageBucket: "fir-auth-af57d.appspot.com",
  messagingSenderId: "482683913886"
};
var secondaryconfig = {
  apiKey: "AIzaSyDlJTDvKb_soQaogqrupnr-55sLg5taRQc",
  authDomain: "test-projecttkj.firebaseapp.com",
  databaseURL: "https://test-projecttkj.firebaseio.com",
  projectId: "test-projecttkj",
  storageBucket: "test-projecttkj.appspot.com",
  messagingSenderId: "913434113779"
};
var secondary = firebase.initializeApp(secondaryconfig, "secondary")
var secondaryDatabase = secondary.database();


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    StockListPage,
    InputStockPage,
    RegisterPage,
    ProfilePage,
    EditStockPage,
    UbahAkunPage,
    CatatanPage,
    AddCatatanPage,
    EditCatatanPage,
    JobListPage,
    AddJobListPage,
    EditJobListPage,
    KeuanganPage,
    AddPendapatanPage,
    EditPendapatanPage,
    AddPengeluaranPage,
    EditPengeluaranPage,
    DepositPage,
    InfoAkunPage,
    TarikKembaliPage,
    HistoriKeuanganPage
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FirebaseAuth),
    AngularFireModule.initializeApp(secondaryconfig, "secondary"),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    StockListPage,
    InputStockPage,
    RegisterPage,
    ProfilePage,
    EditStockPage,
    UbahAkunPage,
    CatatanPage,
    AddCatatanPage,
    EditCatatanPage,
    JobListPage,
    AddJobListPage,
    EditJobListPage,
    KeuanganPage,
    AddPendapatanPage,
    EditPendapatanPage,
    AddPengeluaranPage,
    EditPengeluaranPage,
    DepositPage,
    InfoAkunPage,
    TarikKembaliPage,
    HistoriKeuanganPage
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ScreenOrientation,
   
  ]
})
export class AppModule {}
