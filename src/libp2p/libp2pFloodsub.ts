import { createLibp2p } from 'libp2p'
import { FloodSub } from '@libp2p/floodsub'
import { Noise } from '@chainsafe/libp2p-noise'

export class libp2pFloodsub{
    constructor(){
        //console.log("Libp2p Floodsub - Status - TODO")
    }

    async initAndRun(){
        console.log("using floodsub, peers will be able to connect")

        const node = await createLibp2p({
            addresses: {
              listen: ['/ip4/127.0.0.1/tcp/8001']
            },
            connectionEncryption: [
              new Noise()
            ]
          })
    }


}