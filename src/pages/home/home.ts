import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogServiceProvider } from '../../providers/input-dialog-service/input-dialog-service';
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery List";

  items = [];
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public alertCtrl: AlertController, public dataService: GroceriesServiceProvider, public inputDialogService: InputDialogServiceProvider, public socialSharing: SocialSharing) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems()
    });
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems()
      .subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error);
  }

  editItem(item, id){
    const toast = this.toastCtrl.create({
      message: "Editing Item - " + item.name,
      duration: 3000
    });
    toast.present();
    this.inputDialogService.showPrompt(item, id);
  };

  removeItem(id){
    this.dataService.removeItem(id);
  };

  shareItem(item){
    console.log("Sharing Item - ", item);
    const toast = this.toastCtrl.create({
      message: "Sharing Item - " + item.name,
      duration: 3000
    });
    toast.present();

    let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries App";
    // Check if sharing via email is supported
    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared Successfully!");
    }).catch((error) => {
      // Sharing via email is not possible
      console.log(error);
    });
  };

  addItem(){
    this.inputDialogService.showPrompt();
  };

}
