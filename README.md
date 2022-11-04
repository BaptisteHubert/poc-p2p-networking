# PocP2pNetworking

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.
It aims to test the networking capability of different peer-to-peer solutions.

The current peer-to-peer solution tested is [libp2p](https://libp2p.io/)

## Run the POC
### Locally 
#### Requirements
You will need to have `npm` and `node js` installed. 
Versions used while developing the POC were : `npm@6.14.17` and `node@14.20.1 `

You will also need to install `@libp2p/webrtc-star-signalling-server@^2.0.5`

#### Commands
In a terminal, type these commands

> `npm install -g @libp2p/webrtc-star-signalling-server@^2.0.5`

> `webrtc-star --port=4201 --host=127.0.0.1`

In the `src\libp2p\libp2pWebRTCStar.ts` file, replace line 45 by this code : 

> `'/ip4/127.0.0.1/tcp/4201/wss/p2p-webrtc-star'`

When this is done, go at the root of the poc-p2p-networking folder and run these commands :

> `npm i`

> `npm run build`

> `npm run start`

You will be able to access the app at the url [http://localhost:4200](http://localhost:4200)

**If you have Docker :** 

In the `src\libp2p\libp2pWebRTCStar.ts` file, replace line 45 by this code : 

> `'/ip4/127.0.0.1/tcp/8015/wss/p2p-webrtc-star'`

go at the root of the poc-p2p-networking folder and run these commands :

> `npm i`

> `npm run build`

> `docker-compose up -d`

You will be able to access the app at the url [http://localhost:8013](http://localhost:8013)

### On a server

You can serve the `dist/` folder online as you please.  
If you have Docker, you can type `docker-compose up -d`. Modify the ports used in the Dockerfile to suit your needs.  
Once you have everything setup, modify the address in the `src\libp2p\libp2pWebRTCStar.ts` file, at line 45 and 145 to account for your modifications.

