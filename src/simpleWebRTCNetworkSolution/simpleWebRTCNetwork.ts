import { AppComponent } from '../app/app.component'
import { data } from './data'
import { v4 as uuid } from 'uuid';

export class simpleWebRTCNetwork{

    public ac : AppComponent | undefined

    public wss : WebSocket

    public myName : string

    public loggedIn : boolean

    public peers : string[]

    public connection : RTCPeerConnection

    //@ts-ignore
    public dataChannel : RTCDataChannel

    public connectedTo : string

    public configuration = {
        iceServers: [
            {urls: "stun:openrelay.metered.ca:80"}
        ]
      };

    constructor(appComponent? : AppComponent){
        this.ac = appComponent
        this.myName = uuid()
        this.peers = []
        this.connectedTo = ""

        this.connection = new RTCPeerConnection(this.configuration)
        
        this.wss = new WebSocket("wss://mutehost.loria.fr:8018")
        this.wss.onopen = this.onOpen
        this.wss.onerror  = this.onError
        this.wss.onclose = this.onClose

        //Actions whenever a new event happens on the websocket
        this.wss.onmessage = (event) => {
            switch (JSON.parse(event.data).type){
                case "updateUsers" :
                    this.peers.push(JSON.parse(event.data).user.userName)
                    this.sendOfferWS()
                    break
                case "offer" :
                    this.peers.push(JSON.parse(event.data).name)
                    this.sendAnswerWS(JSON.parse(event.data).offer)
                    break
                case "answer" :
                    console.log(event)
                    this.receiveAnswerWS(JSON.parse(event.data).answer)
                    break
                case "candidate" :
                    this.connection.addIceCandidate(new RTCIceCandidate(JSON.parse(event.data).candidate));
                    break
            }
        }

        //Setting up what happens when an ICECandidate is returned by the browser (happens after this.connection.setLocalDescription)
        this.connection.onicecandidate = ({ candidate }) => {
            if (!!this.connectedTo && candidate != null){
                this.sendDataToWS(new data("candidate", this.peers[0], null, null, candidate))
            }
        };

        //Setting up the logic when peerB receives a message
        this.connection.ondatachannel = event => {
            this.dataChannel = event.channel
            this.dataChannel.onmessage = (text) => {
                this.ac?.receiveTextInTextArea(this.peers[0], text.data)
            };
        };

        this.loggedIn = false
    }

    //Send text to a peer
    sendSomething(textToAdd : string ){
        //Show the user ID
        if (document.getElementById("myNetworkID")!.innerText != this.myName){
            document.getElementById("myNetworkID")!.innerText = this.myName
        }
        this.dataChannel.send(textToAdd)
    }


    //Log in the WebSocket
    loginWs(){
        if (!this.loggedIn) {
            let loginData = new data("login", this.myName, null, null, null)
            this.sendDataToWS(loginData)
            this.loggedIn = true
        }

    }
    
    //Send an offer to a peer over the WebSocket
    sendOfferWS(){
        //Creation of the dataChannel from caller side
        this.dataChannel = this.connection.createDataChannel("chatChannel")

        //Setting up the logic when peerA (the one who initialized the connection to peerB) receives a message
        this.dataChannel.onmessage = (text) => {
            this.ac?.receiveTextInTextArea(this.peers[0], text.data)
        }

        this.connectedTo = this.peers[0]
        this.connection
            .createOffer()
            .then(offer => this.connection.setLocalDescription(offer))
            .then(() => this.sendDataToWS(new data("offer", this.connectedTo, this.connection.localDescription, null, null)))
    }

    //Send an answer to the offer you've been sent to over the WebSocket
    sendAnswerWS(offer : RTCSessionDescriptionInit){
        this.connectedTo = this.peers[0]
        this.connection
            .setRemoteDescription(new RTCSessionDescription(offer))
            .then((() => this.connection.createAnswer()))
            .then(answer => this.connection.setLocalDescription(answer))
            .then(() => this.sendDataToWS(new data("answer", this.connectedTo , null, this.connection.localDescription, null)))
    }

    //Receive the answer from the peer you sent an offer to
    receiveAnswerWS(answer : RTCSessionDescriptionInit){
        this.connection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  

    //Send data to the websocket (using the object data)
    sendDataToWS(data : data){
        this.wss.send(JSON.stringify(data))
    }


    //An event listener called when the websocket is opened
    onOpen(event: any): void {
        console.log("The websocket is opened");
    }

    //An event listener to be called when an error occurs. This is a simple event named "error".
    onError(event: any): void {
        console.log("An error has occured : ", JSON.stringify(event.data));
    }
    
    //An event listener called when the websocket is closed
    onClose(event: any): void {
        console.log(JSON.stringify(event.data));
        console.log("WebSocket closed")
    }
}