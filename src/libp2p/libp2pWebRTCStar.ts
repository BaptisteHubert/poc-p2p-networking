import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Mplex } from '@libp2p/mplex'

import { Multiaddr } from '@multiformats/multiaddr'

import { Noise } from '@chainsafe/libp2p-noise'

import { pipe } from 'it-pipe'

import { consume } from 'streaming-iterables'


import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import PeerId from 'peer-id'


//import { ProtocolHandler } from '../types/libp2p/index.d.ts'
const PROTOCOL = '/chat/1.0.0'

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

          // use stream or connection according to the needs
          console.log(`handle chat from ${connection?.remotePeer.toB58String()}`)

          const handledStream = stream
          //@ts-ignore
          pipe(handledStream, async function (source: AsyncGenerator<any, any, any>) {
            for await (const msg of source) {
              console.log(`Received message: ${msg}`)
            }
            // Causes `consume` in `sendMessage` to close the stream, as a sort
            // of ACK:
            pipe([], handledStream)
          })
        }
        
        await libp2p.handle('/chat/1.0.0', handler)

        

        //this.handleChattingProtocol()
        this.libp2pInstance = libp2p
    }

    
    getAllConnectedPeers(){
      /*
      console.log("Map that saves connected Peers", this.libp2pInstance.connectionManager.peerValues)
      console.log("All entries", this.libp2pInstance.connectionManager.peerValues.entries())*/
      console.log("All my connected peers will be listed under : ")
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        console.log(key);
      }
      
    }



    async sendSomethingToMyConnectedPeers(something : string){
      //The peer store is stored here
      
      //Junk Code
      /*
        console.log(this.libp2pInstance.connectionManager.components.peerStore) -> The peerstore
        console.log(this.libp2pInstance.peerStore.protoBook.get(PeerId.parse(key)))
      */
     something = "HEY THIS MESSAGE IS SENT OVER PEERS"
     const protocol = PROTOCOL
      // Logic for sending data to connected peers
      for (let key of this.libp2pInstance.connectionManager.peerValues.keys()) {
        
        console.log("I'm sending [", something, "] to ", key);

        let addr = "/ip4/127.0.0.1/tcp/8001/wss/p2p-webrtc-star/p2p/" + key
        const peerAddr = new Multiaddr(addr)
        
        

        try {
          const { stream } = await this.libp2pInstance.dialProtocol(peerAddr, [protocol])
          console.log("The stream was created : GREAT SUCCESS")
          //@ts-ignore
          await pipe([something], stream)
        } catch (err) {
          console.log('Send failed; please check console for details.')
          console.error('Could not send the message', err)
        }
        
        
        
        
        
        //let dataArray : Uint8Array
        //dataArray = uint8ArrayFromString(something)

        
        
        /*
        await pipe(
          // Source data
          dataArray,
          // Write to the stream, and pass its output to the next function
          stream,
          // Sink function
          async function (source) {
            // For each chunk of data
            for await (const data of source) {
              // Output the data
              console.log(data)
              //@ts-ignore
              console.log('received echo:', uint8ArrayToString(data))
            }
          }
        )
        */

      }
    }


    async receiveSomethingFromMyConnectedPeers(){
      //TODO
    }

    streamToConsole(stream : any) {
      console.log(stream)
    }

    //functions that returns informations about the network
    logPeersInfo(txt: string) : void {
      console.info(txt)
    }


    getNumberOfConnectedRemotePeers(){
      return this.libp2pInstance.connectionManager.peerValues.size
    }

}


