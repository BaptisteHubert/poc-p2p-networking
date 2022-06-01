import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Mplex } from '@libp2p/mplex'

import { Multiaddr } from '@multiformats/multiaddr'

import { Noise } from '@chainsafe/libp2p-noise'



export class libp2pWebRTCStar {

    libp2pInstance : any


    constructor(){
        console.log("Libp2p WebRTC Star")
    }

    async initAndRun(){
        console.log("using WebRTCStar, peers will be able to connect")
        const webRtcStar = new WebRTCStar()
        // Create our libp2p node
        const libp2p = await createLibp2p({

            addresses: {
              // Add the signaling server address, along with our PeerId to our multiaddrs list
              // libp2p will automatically attempt to dial to the signaling server so that it can
              // receive inbound connections from other peers
              listen: [
                '/ip4/127.0.0.1/tcp/8001/wss/p2p-webrtc-star'
              ]
            },
            transports: [
              new WebSockets(),
              webRtcStar
            ],
            connectionEncryption: [new Noise()],
            streamMuxers: [new Mplex()],
            peerDiscovery: [
              webRtcStar.discovery
            ]
        })

        /* Following event listener are there to see what's happening on the network*/
        //Listen for peers discovered
        /*
        libp2p.addEventListener('peer:discovery', (evt) => {
            const peer = evt.detail
            this.logPeersInfo(`Found peer ${peer.id.toString()}`)
        })
        */

        // Listen for new connections to peers
        libp2p.connectionManager.addEventListener('peer:connect', (evt) => {
            const connection = evt.detail
            this.logPeersInfo(`Connected to ${connection.remotePeer.toString()}`)
        })
        
        // Listen for peers disconnecting
        libp2p.connectionManager.addEventListener('peer:disconnect', (evt) => {
            const connection = evt.detail
            this.logPeersInfo(`Disconnected from ${connection.remotePeer.toString()}`)
        })

        console.log("my libp2p id is ",libp2p.peerId.toString())

        await libp2p.start()

        this.libp2pInstance = libp2p
    }

    
    logPeersInfo(txt: string) : void {
        console.info(txt)
    }

    createStreamWithAllPeers(){
      /*
      console.log("Map that saves connected Peers", this.libp2pInstance.connectionManager.peerValues)
      console.log("All entries", this.libp2pInstance.connectionManager.peerValues.entries())*/
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        console.log(key);
      }
      this.sendSomethingToMyConnectedPeers("test")
    }

    getNumberOfConnectedRemotePeers(){
      return this.libp2pInstance.connectionManager.peerValues.size
    }

    async sendSomethingToMyConnectedPeers(something : string){
      // Create a new libp2p node on localhost with a randomly chosen port
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        console.log(key);
        let addr = "/ip4/127.0.0.1/tcp/8001/p2p/" + key
        const peerAddr = new Multiaddr(addr)
        const { stream } = await this.libp2pInstance.dialProtocol(peerAddr, '/chat')

        // Read the stream and output to console
        this.streamToConsole(stream)
        
      }
    }

    streamToConsole(stream : any) {
      console.log(stream)
    }

    getSomethingFromMyConnectedPeers(){
      console.log("I shall receive something")
    }

}

