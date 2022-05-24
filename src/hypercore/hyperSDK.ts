/* Removing the hyperCore implementation as we focus on libp2p
const SDK = require('/node_modules/hyper-sdk/hyper-sdk-bundle.js')

export class hyperSDK{

    public hyperCore : any

    public coreKey : string

    constructor(id: string){  
        this.coreKey = id
    }

    async addDataToHypercore(input : string){
        await this.hyperCore.append(input)
        console.log(this.hyperCore)
    }

    async initAndRun () {
        //Creating SDK
        const sdk = await SDK({
            applicationName: "poc",
            persist: false,
            swarmOpts : {
                maxPeers: 25,
                wsProxy: 'ws://localhost:4201/proxy',
            },
          });

        const {
            Hypercore,
        } = sdk

        //Creating Hypercore
        const coreToSeed = Hypercore(this.coreKey, {
            valueEncoding: 'utf',
            persist: false,
            storage: null
        })

        
        coreToSeed.append("1")
        console.log(coreToSeed)
        coreToSeed.append("2")
        
        console.log(coreToSeed)
        coreToSeed.append("3")
        
        console.log(coreToSeed)

        this.hyperCore = coreToSeed

        // Register the extension message handler - WIP
        const extension = sdk.registerExtension('discovery', {
	        // Set the encoding type for messages
	        encoding: 'binary',
	        onmessage: (message: any, peer: any) => {
		        // Received messages will be automatically decoded
		        console.log('Got key from peer!', message)

		        const otherCore = Hypercore(message, {
                    valueEncoding: 'json',
                    persist: false
                })
    
                // Render the peer's data from their core
                otherCore.get(0, console.log)

                // When you find a peer tell them about your core
                this.hyperCore.on('peer-add', (peer: any) => {
	                console.log('Got a peer!')
	                extension.send(this.hyperCore.key, peer)
                })
	        }
        })
    }
}*/