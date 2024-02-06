import { io } from "socket.io-client";
import { retrieveData } from "./AsyncStore";

const SOCKET_URL = 'https://nodeserver.mydevfactory.com:6098';

class WSService {

    initializeSocket = async () => {

        var usertoken = await retrieveData('USER_TOKEN');
       // let UToken = JSON.parse(usertoken);
        console.warn('TOKENNNNNNNNNNNNN', usertoken);
        try {


            if (usertoken != null && usertoken != '' && usertoken != 'null'){
            this.socket = io(SOCKET_URL, {
                //  transports: ['websocket'],
                query: { token: usertoken },
                connected: true
            })
        

            console.log("initializing socket========", this.socket)



                this.socket.on('connect', (data) => {
                    console.log("==========SOCKET CONNECTED==========");
                    console.log("============", this.socket.connected)
                })


                // this.socket.on('disconnect', (data) => {
                //     console.log("==========SOCKET DISCONNECTED==========")
                // })




            // this.socket.emit('message', {text:"Sapta singha"});



            this.socket.on('error', (data) => {
                console.log("SOCKET ERROR", data)
            })
        }

        } catch (error) {
            console.log("Error in socket! not initialized", error);
        }
    }
    disconnect_socket=async()=>{
        var usertoken = await retrieveData('USER_TOKEN');
        // let UToken = JSON.parse(usertoken);
         console.warn('TOKENNNNNNNNNNNNN', usertoken);
         try {


            if (usertoken != null && usertoken != '' && usertoken != 'null'){
            this.socket = io(SOCKET_URL, {
                //  transports: ['websocket'],
                query: { token: usertoken },
                connected: true
            })
            console.log("initializing socket========", this.socket)
            
            if (this.socket != null) {
                console.warn('OKKKKK');
                this.socket.on('connected', (data) => {
                  console.warn('connected>>>>>>>>>>>>>>>>>>>>', data);
        
                  if (this.socket.connected) {
                    //socket1.disconnect();
                    //this.socket.emit('disconnectSocket', userId);
                    this.socket.disconnect()
                    console.warn('connect status', this.socket.connected);
                    this.socket.disconnect()
                  }
                });
              }
        }

        } catch (error) {
            console.log("Error in socket! not initialized", error);
        }
    }

    emit(event, data = {}) {
        this.socket.emit('message', event, data)
    }

    on(event, callback) {
        this.socket.on('message', event, callback)
    }

    removeListner(listnerName) {
        this.socket.removeListener('message', listnerName)
    }

    
}

const socketService = new WSService()

export default socketService;