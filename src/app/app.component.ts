import { Component } from '@angular/core';
//import { hyperSDK } from 'src/hypercore/hyperSDK';
import { v4 as uuid } from 'uuid';

import { libp2pWebRTCStar } from 'src/libp2p/libp2pWebRTCStar'

import { libp2pFloodsub } from 'src/libp2p/libp2pFloodsub'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'poc-p2p-networking';

  public numberOfPeers : number = 1;

  public typeOfNetwork : string = "";

  public libp2pInstanceWRTCS : libp2pWebRTCStar


  public libp2pInstanceFS : libp2pFloodsub 

  constructor(){
    const joiningKey = uuid()
    this.libp2pInstanceWRTCS = new libp2pWebRTCStar()
    this.libp2pInstanceFS = new libp2pFloodsub()
    this.libp2pInstanceWRTCS.initAndRun()
  }



  addTextToTextArea(){
    const textArea = document.querySelector('#textArea') as HTMLInputElement;
    const textToAdd = document.querySelector('#textToAdd') as HTMLInputElement;
    if ((textArea && textToAdd) != null && textToAdd.value != ""){ 
      textArea.value += textToAdd.value + "\n"
    }
    textToAdd.value = ""
  }

  updateConnectedPeers(){
    this.numberOfPeers = this.libp2pInstanceWRTCS.getNumberOfConnectedRemotePeers() + 1
    this.libp2pInstanceWRTCS.createStreamWithAllPeers()
  }

}