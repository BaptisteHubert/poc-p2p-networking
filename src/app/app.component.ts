import { Component } from '@angular/core';
//import { hyperSDK } from 'src/hypercore/hyperSDK';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  
  title = 'poc-p2p-networking';

  public numberOfPeers : number = 1;

  public typeOfNetwork : string = "";

  //public hyperSDK : any

  constructor(){
    const joiningKey = uuid()
    /*
    const hypSDK = new hyperSDK(joiningKey)
    hypSDK.initAndRun()
    this.hyperSDK = hypSDK
    */
   }



  addTextToTextArea(){
    const textArea = document.querySelector('#textArea') as HTMLInputElement;
    const textToAdd = document.querySelector('#textToAdd') as HTMLInputElement;
    if ((textArea && textToAdd) != null && textToAdd.value != ""){ 
      textArea.value += textToAdd.value + "\n"
    }
    textToAdd.value = ""

  }

}