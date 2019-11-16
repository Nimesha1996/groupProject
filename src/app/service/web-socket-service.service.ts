import { Injectable } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import * as SockJS from 'sockjs-client';
import { UserModel } from '../ClassModel/UserModel';
import * as Stomp from 'stompjs';
import { WebSocketCommunicationDataMap } from '../ClassModel/MapObject/WebSocketCommunicationDataMap';
import { NotificationServisceService } from './notification/notification-service.service';
import { API_URL, SPRING_SECURITY_USER_NAME, SPRING_SECURITY_PASSWORD, WEBSOCKETENDPOINT, WEBSOCKETTOPIC } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {


    topic: string = "/topic/greetings";
    stompClient: any;
   
    constructor(){
    }
    _connect() {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(WEBSOCKETENDPOINT);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(WEBSOCKETTOPIC, function (sdkEvent) {
                _this.onMessageReceived(sdkEvent);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };

    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect();
        }, 5000);
    }

 /**
  * Send message to sever via web socket
  * @param {*} message 
  */
    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
        console.log("Message Recieved from Server :: " + message);
    }
}
