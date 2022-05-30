import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Mplex } from '@libp2p/mplex'

import { Bootstrap } from '@libp2p/bootstrap'

import { Noise } from '@chainsafe/libp2p-noise'

export class libp2pWebRTCStar {

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
              webRtcStar.discovery,
              new Bootstrap({
                list: [
                  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
                ]
              })
            ]
        })



        libp2p.addEventListener('peer:discovery', (evt) => {
            const peer = evt.detail
            this.logPeersInfo(`Found peer ${peer.id.toString()}`)
          })
        
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


    }
    
    logPeersInfo(txt: string) : void {
        console.info(txt)
    }


        /*
        // Listen for new peers
      libp2p.addEventListener('peer:discovery', (evt) => {
        const peer = evt.detail
        log(`Found peer ${peer.id.toString()}`)
      })
    
      // Listen for new connections to peers
      libp2p.connectionManager.addEventListener('peer:connect', (evt) => {
        const connection = evt.detail
        log(`Connected to ${connection.remotePeer.toString()}`)
      })
    
      // Listen for peers disconnecting
      libp2p.connectionManager.addEventListener('peer:disconnect', (evt) => {
        const connection = evt.detail
        log(`Disconnected from ${connection.remotePeer.toString()}`)
      })
    
      await libp2p.start()
      status.innerText = 'libp2p started!'
      log(`libp2p id is ${libp2p.peerId.toString()}`)
    }
*/
    

    
    
      
}