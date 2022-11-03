import { Component } from '@angular/core';
//import { hyperSDK } from 'src/hypercore/hyperSDK';
import { v4 as uuid } from 'uuid';

import { libp2pWebRTCStar } from 'src/libp2p/libp2pWebRTCStar'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'poc-p2p-networking';

  public numberOfPeers : number = 1;

  public numberOfPeersConnectedToMe : number = 0

  public typeOfNetwork : string = "";

  public libp2pInstanceWRTCS : libp2pWebRTCStar

  constructor(){
    const joiningKey = uuid()
    this.libp2pInstanceWRTCS = new libp2pWebRTCStar(this)
    this.libp2pInstanceWRTCS.initAndRun()
  }

  addTextToTextArea(){
    const textArea = document.querySelector('#textArea') as HTMLInputElement;
    const textToAdd = document.querySelector('#textToAdd') as HTMLInputElement;

    this.libp2pInstanceWRTCS.sendSomethingToMyConnectedPeers(textToAdd.value)

    if ((textArea && textToAdd) != null && textToAdd.value != ""){ 
      textArea.value += "Me : " + textToAdd.value + "\n"
    }
    textToAdd.value = ""
  }

  receiveTextInTextArea(sender : string, textReceived : string){
    const textArea = document.querySelector('#textArea') as HTMLInputElement;
    textArea.value += sender.slice(-8) +" : " + textReceived + "\n"
  }

  updateConnectedPeers(){
    this.numberOfPeers = this.libp2pInstanceWRTCS.getNumberOfConnectedRemotePeers() + 1
    this.numberOfPeersConnectedToMe = this.libp2pInstanceWRTCS.getNumberOfConnectedRemotePeers()
  }

  changeSendingStrategy(){
    this.libp2pInstanceWRTCS.changeChangeSendingStrategy(document.getElementById("buttonSendingStrategy")!.innerText)
  }

  async logInfoConnectedPeers(){
    this.libp2pInstanceWRTCS.getAllConnectedPeers()
  }

}