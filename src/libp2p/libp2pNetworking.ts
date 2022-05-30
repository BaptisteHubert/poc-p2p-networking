
import { createLibp2p } from 'libp2p'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'
import { Bootstrap } from '@libp2p/bootstrap'
import { MulticastDNS } from '@libp2p/mdns'


export class libp2pNetworking{
    constructor(){
        console.log("using libp2p as a network layer")
    }

    async initAndRun(){
        const node = await createLibp2p({
            addresses: {
              listen: ['/ip4/127.0.0.1/tcp/8000']
            },
            addressManager: {
              autoDial: true
            },
            connectionManager: {
              dialTimeout: 60000
            },
            transports: [
              new webrtc()
            ],
            streamMuxers: [
              new Mplex()
            ],
            connectionEncryption: [
              new Noise()
            ],
            dht: new KadDHT(),
            pubsub: new Gossipsub(),
            peerDiscovery: [
              new Bootstrap({
                list: [
                  // .. multiaddrs here
                ],
                interval: 2000
              }),
              new MulticastDNS({
                interval: 1000
              })
            ]
          })

        return node
    }

/*
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'

export class libp2pNetworking{
    constructor(){
        console.log("using libp2p as a network layer")
    }

    async initAndRun(){
        console.log("Initialization")
        const libp2p = await Libp2p.create({
            modules: {
              transport: [WebRTCStar],
              connEncryption: [new Noise()],
              streamMuxer: [new Mplex()],
              peerDiscovery: [WebRTCStar.discovery]
            },
            config: {
              peerDiscovery: {
                bootstrap: {
                  enabled: true,
                  list: [
                    '/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
                    '/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3',
                    '/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
                    '/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu',
                    '/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm',
                    '/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/p2p/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64'
                  ]
                }
              }
            }
          })
    }
}
*/
