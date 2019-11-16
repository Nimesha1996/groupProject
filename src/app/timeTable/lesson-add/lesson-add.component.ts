import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeTableServiceService } from '../../service/TimeTable/time-table-service.service';
import { TimeSlotModel } from '../../ClassModel/TimeSlotModel';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { PackageServiceService } from '../../service/package/package-service.service';
import { PackageModel } from '../../ClassModel/PackageModel';
import { Path } from '../../ClassModel/PathModel';
import { InstructorMap } from '../../ClassModel/MapObject/InstructorMap';
import Swal from 'sweetalert2';
import { WebSocketServiceService } from '../../service/web-socket-service.service';
import { WebSocketCommunicationDataMap } from '../../ClassModel/MapObject/WebSocketCommunicationDataMap';
import { NotificationServisceService } from '../../service/notification/notification-service.service';



@Component({
  selector: 'app-lesson-add',
  templateUrl: './lesson-add.component.html',
  styleUrls: ['./lesson-add.component.scss']
})
export class LessonAddComponent implements OnInit {

  timeSlotListData:TimeSlotModel[]=[];
  packageListData:PackageModel[]=[];
  pathListData:Path[]=[];
  instructorListData:InstructorMap[]=[];

  dayListData:any[] = [
    {id:1 ,name:'Monday'},
    {id:2 ,name:'Tuesday'},
    {id:3 ,name:'Wednesday'},
    {id:4 ,name:'Thursday'},
    {id:5 ,name:'Friday'},
    {id:6 ,name:'Saturday'},
    {id:0 ,name:'Sunday'}
  ];

  errorMessage;

  //form Variable
  selectDay;
  selectTimeSlot:TimeSlotModel;
  selectPath:Path;
  selectInstructor:InstructorMap;
  selectPackage:PackageModel;
  selectTransmission=1;
  numStudent;

  //error message of form variable
  errorSelectDay;
  errorSelectTimeSlot;
  errorSelectPath;
  errorSelectInstructor;
  errorSelectPackage;
  //errorSelectTransmission;
  errorNumStudent;

  isTransmissionSelect;
  isdisableInstructor=true;

  webSocketService:WebSocketServiceService;
  
  constructor(
    private router:Router,
    private timeTableService:TimeTableServiceService,
    private packageService:PackageServiceService,
    private notificationService:NotificationServisceService
  ) { }

  ngOnInit() {
    this.webSocketService = new WebSocketServiceService();

    this.timeSlotList();
    this.packageList();
    this.pathList();
  }

  //get time Slot Details
  timeSlotList(){
      this.timeTableService.getTimeSlotList().subscribe(
        response => {
            this.timeSlotListData=response;
        },
        error => {
            console.log(error);
            this.handleErrorResponse(error);
        }
      );
  }

  //get package Details
  packageList(){
    this.packageService.packageList().subscribe(
      response => {
          this.packageListData=response;
      },
      error => {
          console.log(error);
          this.handleErrorResponse(error);
      }
    );
  }

  //get path List
  pathList(){
    this.timeTableService.getPathList().subscribe(
      response => {
        this.pathListData=response;
        console.log(this.pathList)
      },
      error => {
          console.log(error);
          this.handleErrorResponse(error);
      }
    )
  }

  //Save the lesson data
  save(){
    let errorFlag=false;

    this.errorSelectDay="";
    this.errorSelectTimeSlot="";
    this.errorSelectPath="";
    this.errorSelectInstructor="";
    this.errorSelectPackage="";
    //this.errorSelectTransmission="";
    this.errorNumStudent="";

    if(this.selectDay == null){
        this.errorSelectDay="Day should be selected.";
        errorFlag=true;
    }
    if(this.selectTimeSlot == null){
        this.errorSelectTimeSlot="Time should be selected.";
        errorFlag=true;
    }
    if(this.selectPackage == null){
        this.errorSelectPackage="Package should be selected.";
        errorFlag=true;
    }
    if(this.selectPath == null){
      this.errorSelectPath="Path should be selected.";
      errorFlag=true;
    }
    if(this.selectInstructor == null){
      this.errorSelectInstructor="Instructor should be selected.";
      errorFlag=true;
    }
    if(this.numStudent == null){
      this.errorNumStudent="Insert valid input.";
      errorFlag=true;
    }

    if(!errorFlag){
      this.timeTableService.addLesson(this.selectDay,this.selectTimeSlot.timeSlotId,this.selectPath.pathId,this.selectPackage.packageId,this.selectInstructor.instructorId,this.numStudent,this.selectTransmission).subscribe(
       response => {
         //change inform to notificationSerivce
         let data = new WebSocketCommunicationDataMap([0,0,0,1,1]);
         this.notificationService.notifyChange(data); 

         Swal.fire({
          position: 'top-end',
          type: 'success',
          title: 'Save Successful.',
          showConfirmButton: false,
          timer: 1500
          });
          this.router.navigate(['time-table'])
       },
       error => {
        console.log(error);
        this.handleErrorResponse(error);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: "Save Not Completed.",
          footer: 'Something bad happened, please try again later.'
        });
       }
      )
    }
  }

 //error handling
 private handleErrorResponse(error: HttpErrorResponse) {
  let httpError = new HttpError();
  this.errorMessage=httpError.ErrorResponse(error);
  console.log(this.errorMessage);
};


  //button
  timeSlot(){
    this.router.navigate(['time-slot']);
  }

  maps(){
    this.router.navigate(['path-map']);
  }

  showTransmission(pac:PackageModel){
    this.isTransmissionSelect=false;
    if( (pac.manualLes >0) && (pac.autoLes>0)){
        this.isTransmissionSelect=true;
    }
    this.showInstructor();
  }

  selectOption(option){
      if(option===1) {this.selectTransmission=1;}
      else {this.selectTransmission=2;}
      this.showInstructor();
  }

  showInstructor(){
   
    this.isdisableInstructor=true;
    if( this.selectDay!=null && this.selectPackage!=null && this.selectTimeSlot!=null && this.selectPath!=null){
        let transmission=0;

        //find selection transmission
        if(this.selectPackage.autoLes>0 && this.selectPackage.manualLes>0){
          (this.selectTransmission === 1)? transmission=1 : transmission=2;
        }else if(this.selectPackage.manualLes>0){
          transmission=1
        }else if(this.selectPackage.autoLes>0){
          transmission=2;
        }

      
        //get Instructor List
        this.timeTableService.getRelevantInstructorsList(this.selectDay,this.selectPackage.packageId,this.selectTimeSlot.timeSlotId,this.selectPath.pathId,transmission).subscribe(
          response => {
              this.instructorListData=response;
              if(this.instructorListData.length>0){
                this.isdisableInstructor=false;
              }
          },
          error => {
              console.log(error);
              this.handleErrorResponse(error);
          }
        )
    }
  }

}
