import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Mplex } from '@libp2p/mplex'
import { Multiaddr } from '@multiformats/multiaddr'
import { Noise } from '@chainsafe/libp2p-noise'
import { pipe } from 'it-pipe'

import { fromString, toString} from 'uint8arrays'

const PROTOCOL = '/chat/1.0.0'

export class libp2pWebRTCStar {

    libp2pInstance : any

    addrTest : Multiaddr

    constructor(){
        console.log("Libp2p WebRTC Star")
        this.addrTest = new Multiaddr()
    }

    async initAndRun(){
        console.log("using WebRTCStar, peers will be able to connect")
        const webRtcStar = new WebRTCStar()
        // Create our libp2p node
        const libp2p = await createLibp2p({
            addresses: {
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

      
        //Handling the protocol used to dial other peers
        //@ts-ignore
        const handler = ({ connection, stream} ) => {
          console.log("I receive")
          // use stream or connection according to the needs
          console.log("handle chat from ", connection.remotePeer.string)
          const handledStream = stream
          //@ts-ignore
          pipe(stream, async function (source: AsyncGenerator<any, any, any>) {
            for await (const msg of source) {
              let sourceToString = toString(msg)
              console.log(`RECEIVED MESSAGE AS : ${sourceToString}`)
            }
          })
        }
        
        await libp2p.handle('/chat/1.0.0', handler)
        

        this.libp2pInstance = libp2p
    }

    async sendSomethingToMyConnectedPeers(something : string){
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        let addr = "/ip4/127.0.0.1/tcp/8001/wss/p2p-webrtc-star/p2p/" + key
        const peerAddr = new Multiaddr(addr)
        try {
          console.log("I send")
          const { stream } = await this.libp2pInstance.dialProtocol(peerAddr, [PROTOCOL])
          //@ts-ignore
          await pipe([fromString(something)], stream)
        } catch (err) {
          console.error('Could not send the message', err)
        }
      }
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
      console.log("All my connected peers will be listed under : ")
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        console.log(key);
      }
    }

}


