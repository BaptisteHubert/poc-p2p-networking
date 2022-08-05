import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Mplex } from '@libp2p/mplex'
import { Multiaddr } from '@multiformats/multiaddr'
import { Noise } from '@chainsafe/libp2p-noise'
import { pipe } from 'it-pipe'

import { fromString, toString} from 'uint8arrays'

import { AppComponent } from 'src/app/app.component'

const PROTOCOL = '/chat/1.0.0'

export class libp2pWebRTCStar {

    libp2pInstance : any

    addrTest : Multiaddr

    public ac : AppComponent

    sendingOptions : string

    
    listOfKnownRemotePeer : string[]

    constructor(appComponent : AppComponent){
        //console.log("Libp2p WebRTC Star - Status - Working")
        this.addrTest = new Multiaddr()
        this.ac = appComponent
        this.sendingOptions = "everyone"
        this.listOfKnownRemotePeer = []
    }

    async initAndRun(){
        console.log("using WebRTCStar, peers will be able to connect")
        const webRtcStar = new WebRTCStar()
        const transportKey = WebRTCStar.prototype[Symbol.toStringTag]
        // Create our libp2p node
        const libp2p = await createLibp2p({
            addresses: {
              listen: [
                //local address - '/ip4/127.0.0.1/tcp/4201/wss/p2p-webrtc-star'
                //wss adress over ngrok tcp '/dns6/5.tcp.eu.ngrok.io/tcp/10210/ws/p2p-webrtc-star'
                //wss adress over ngrok http 
                '/dns4/mutehost.loria.fr/tcp/8012/wss/p2p-webrtc-star/'
              ]
            },
            transports: [
              //@ts-ignore
              //new WebSockets(),
              //@ts-ignore
              webRtcStar
            ],
            connectionEncryption: [new Noise()],
            //@ts-ignore
            streamMuxers: [new Mplex()],
            peerDiscovery: [
              webRtcStar.discovery
            ]
            ,
            config: {
              transport: {
                [transportKey]: {
                  listenerOptions: {
                    config: {
                      iceServers: [
                        {"urls": "stun:openrelay.metered.ca:80"},
                        {"urls": ["turn:openrelay.metered.ca:80"], "username": "openrelayproject", "credential": "openrelayproject"},
                        {"urls": ["turn:openrelay.metered.ca:443"], "username": "openrelayproject", "credential": "openrelayproject"},
                        {"urls": ["turn:openrelay.metered.ca:443?transport=tcp"], "username": "openrelayproject", "credential": "openrelayproject"}
                        
                      ]
                    }
                  }
                }
              }
            }

        })

        /* Following event listener are there to see what's happening on the network*/
        //Listen for peers discovered
        /*
        libp2p.addEventListener('peer:discovery', (evt) => {
            const peer = evt.detail
            console.log(`Found peer ${peer.id.toString()}`)
        })
        */

        // Listen for new connections to peers
        libp2p.connectionManager.addEventListener('peer:connect', (evt) => {
            const connection = evt.detail
            console.log(`Connected to ${connection.remotePeer.toString()}`)
            this.listOfKnownRemotePeer.push(connection.remotePeer.toString())
            this.ac.updateConnectedPeers()
        })
        
        // Listen for peers disconnecting
        libp2p.connectionManager.addEventListener('peer:disconnect', (evt) => {
            const connection = evt.detail
            console.log(`Disconnected from ${connection.remotePeer.toString()}`)
            const indexOfPeer = this.listOfKnownRemotePeer.indexOf(connection.remotePeer.toString())
            if (indexOfPeer != -1){
              this.listOfKnownRemotePeer.splice(indexOfPeer,1)
            }
            this.ac.updateConnectedPeers()
        })

        document.getElementById("myLibp2pId")!.innerText = libp2p.peerId.toString()
        console.log("my libp2p id is ",libp2p.peerId.toString())

        await libp2p.start()
        
        //Handling the protocol used to dial other peers
        //@ts-ignore
        const handler = ({ connection, stream} ) => {
          let me = this
          console.log("I receive")
          // use stream or connection according to the needs
          console.log("handle chat from ", connection.remotePeer.string)
          const handledStream = stream
          console.log(handledStream)
          //@ts-ignore
          pipe(stream, async function (source: AsyncGenerator<any, any, any>) {
            for await (const msg of source) {
              let sourceToString = toString(msg)
              console.log(`RECEIVED MESSAGE AS : ${sourceToString}`)
              me.ac.receiveTextInTextArea(connection.remotePeer.string, sourceToString)
            }
          })
        }
        
        await libp2p.handle('/chat/1.0.0', handler)
        this.libp2pInstance = libp2p
    }

    async sendSomethingToMyConnectedPeers(something : string){
      let addr = "/ip4/127.0.0.1/tcp/8001/wss/p2p-webrtc-star/p2p/"
      
      if (this.sendingOptions == "everyone"){
        for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
          const peerAddr = new Multiaddr(addr + key)
          this.sendMessage(something, peerAddr)
        }
      } else {
        //Choosing a random value in the known peers list
        const random = Math.floor(Math.random() * this.listOfKnownRemotePeer.length);
        this.sendMessage(something, new Multiaddr(addr + this.listOfKnownRemotePeer[random]))
      }
    }

    async sendMessage(messageToSend : string, peerMultiAddr : Multiaddr){
      try {
        const { stream } = await this.libp2pInstance.dialProtocol(peerMultiAddr, [PROTOCOL])
        //@ts-ignore
        await pipe([fromString(messageToSend)], stream)
      } catch (err) {
        console.error('Could not send the message', err)
      }
    }

    changeChangeSendingStrategy(buttonTextValue : string){
      if (buttonTextValue == "everyone"){
        this.sendingOptions = "a random peer"
      } else {
        this.sendingOptions = "everyone"
      }
      document.getElementById('buttonSendingStrategy')!.innerHTML = this.sendingOptions

    }

    //functions that returns informations about the network
    logPeersInfo(txt: string) : void {
      console.info(txt)
    }

    getNumberOfConnectedRemotePeers(){
      return this.libp2pInstance.connectionManager.peerValues.size
    }

    getAllConnectedPeers(){
      console.log("Map that saves connected Peers", this.libp2pInstance.connectionManager.peerValues)
      console.log("All entries", this.libp2pInstance.connectionManager.peerValues.entries())
      console.log("All my connected peers (according to libp2p) : ")
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        console.log(key);
      }
      console.log("All my stored peers : ")
      for (let key of this.listOfKnownRemotePeer){
        console.log(key)
      }

    }

}


