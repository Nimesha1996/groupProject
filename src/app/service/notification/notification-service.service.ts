import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_URL } from '../../app.constants';
import { NotificationDataMap } from '../../ClassModel/MapObject/NotificationDataMap';
import { WebSocketServiceService } from '../web-socket-service.service';
import { WebSocketCommunicationDataMap } from '../../ClassModel/MapObject/WebSocketCommunicationDataMap';


@Injectable({
  providedIn: 'root'
})
export class NotificationServisceService {

  constructor(
    private http : HttpClient, 
  ) { }

  getNotification(userId,role,notificationType){
    return this.http.get<[NotificationDataMap]>(`${API_URL}/notification/${userId}/${role}/${notificationType}`);
  }

  //Mark Notification as read
  updateNotification(role,notificationList){
    return this.http.put<any>(`${API_URL}/notification/${role}`,notificationList);
  }
  
  //Notification Change Inform to webSocket
  notifyChange(data:WebSocketCommunicationDataMap){
    let webSocketService = new WebSocketServiceService();
    webSocketService._connect();//connect to the webSocket
    this.connectWait(3000,webSocketService,data);
    this.disConnectWait(10000,webSocketService);
  }

  async connectWait(ms: number,webSocketService:WebSocketServiceService,data:WebSocketCommunicationDataMap) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=> 
        webSocketService._send(data)
    );
  }

  async disConnectWait(ms: number,webSocketService:WebSocketServiceService) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=> 
        webSocketService._disconnect()
    );
  }
}
