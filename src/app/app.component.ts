import { Component } from '@angular/core';
const HyperspaceClient = require('@hyperspace/client')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'poc-p2p-networking';

  public numberOfPeers : number;

  public typeOfNetwork : string = "";

  constructor(){
    this.numberOfPeers = 1

    const client = new HyperspaceClient()
  }
}
