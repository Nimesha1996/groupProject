import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router } from '@angular/router';
import { NotificationDataMap } from '../../ClassModel/MapObject/NotificationDataMap';
import { NotificationServisceService } from '../../service/notification/notification-service.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { WebSocketCommunicationDataMap } from '../../ClassModel/MapObject/WebSocketCommunicationDataMap';
import { API_URL, WEBSOCKETENDPOINT, WEBSOCKETTOPIC } from '../../app.constants';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    userId;
    userRole;
    newNotificationList:NotificationDataMap[]=[];
    earlyNotification:NotificationDataMap[]=[];
    isNewNotification=false;
    isEarlyNotification=false;
    isNotificationBadgeOn=true;

    //WebSocket
    stompClient: any;
    webSocketService;
 

    private listTitles: any[];
    location: Location;
      mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;

    public isCollapsed = true;

    
    constructor(location: Location,  private element: ElementRef, private router: Router,private notificationService:NotificationServisceService) {
      this.location = location;
      this.sidebarVisible = false;
    }
   

    ngOnInit(){
      this.listTitles = ROUTES.filter(listTitle => listTitle);
      const navbar: HTMLElement = this.element.nativeElement;
      this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
      this.router.events.subscribe((event) => {
        this.sidebarClose();
         var $layer: any = document.getElementsByClassName('close-layer')[0];
         if ($layer) {
           $layer.remove();
           this.mobile_menu_visible = 0;
         }
     });

     this.userId=sessionStorage.getItem("userId");
     this.userRole=sessionStorage.getItem("userRole");
     this.getNotification();

     if(this.userRole==4 || this.userRole==5){
       this._connect();
     } 
    }

    collapse(){
      this.isCollapsed = !this.isCollapsed;
      const navbar = document.getElementsByTagName('nav')[0];
      console.log(navbar);
      if (!this.isCollapsed) {
        navbar.classList.remove('navbar-transparent');
        navbar.classList.add('bg-white');
      }else{
        navbar.classList.add('navbar-transparent');
        navbar.classList.remove('bg-white');
      }

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        const html = document.getElementsByTagName('html')[0];
        if (window.innerWidth < 991) {
          mainPanel.style.position = 'fixed';
        }

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (window.innerWidth < 991) {
          setTimeout(function(){
            mainPanel.style.position = '';
          }, 500);
        }
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const html = document.getElementsByTagName('html')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const html = document.getElementsByTagName('html')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            html.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (html.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (html.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
              html.classList.remove('nav-open');
              this.mobile_menu_visible = 0;
              $layer.classList.remove('visible');
              setTimeout(function() {
                  $layer.remove();
                  $toggle.classList.remove('toggled');
              }, 400);
            }.bind(this);

            html.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      titlee = titlee.split('/').pop();

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }

    logOut(){
      this._disconnect();
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userRole');
      this.router.navigate(['']);
    }

    profile(){
      let role=sessionStorage.getItem('userRole');
      if(role == '1'){

      }else if(role == '2'){

      }else if(role == '3'){
        
      }else if(role == '4'){

      }else if(role == '5'){
        this.router.navigate(['student-profile']);
      }
    }

    getNotification(){
      console.log("Call");
      this.newNotificationList=[];
      this.earlyNotification=[];

       //get unread notification
       this.notificationService.getNotification(this.userId,this.userRole,0).subscribe(
         response => {
           console.log(response)
            this.newNotificationList=response;
            if(this.newNotificationList.length>0){
              this.isNewNotification=true;
            }
         },
         error => {
           console.log(error);
         }
       );

       //get read notification
       this.notificationService.getNotification(this.userId,this.userRole,1).subscribe(
        response => {
           this.earlyNotification=response;
           if(this.earlyNotification.length>0){
             this.isEarlyNotification=true;
           }
        },
        error => {
          console.log(error);
        }
      );
  }

  updateNotification(){
    this.notificationService.updateNotification(this.userRole,this.newNotificationList).subscribe(
      response => {
        console.log("Update Notifications");
      },
      error => {
        console.log(error);
      }
    )
  }

  notificationBadge(){
    this.isNotificationBadgeOn=false;
    this.updateNotification();
  }

  //WebSocket Configuration
  _connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(WEBSOCKETENDPOINT);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
        _this.stompClient.subscribe(WEBSOCKETTOPIC, function (sdkEvent) {
            _this.onMessageReceived(JSON.parse(sdkEvent.body)); 
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

  onMessageReceived(message:WebSocketCommunicationDataMap) {
      console.log("Message Recieved from Server :: " + message);
      console.log(message);
      if((message.role[3]==1 || message.role[4]==1)){
        console.log("Hello");
        this.getNotification();
      }
  }

}


