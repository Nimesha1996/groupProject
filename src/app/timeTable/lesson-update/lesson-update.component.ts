import { Component, OnInit } from '@angular/core';
import { TimeSlotModel } from '../../ClassModel/TimeSlotModel';
import { PackageModel } from '../../ClassModel/PackageModel';
import { Path } from '../../ClassModel/PathModel';
import { InstructorMap } from '../../ClassModel/MapObject/InstructorMap';
import { Router, ActivatedRoute } from '@angular/router';
import { TimeTableServiceService } from '../../service/TimeTable/time-table-service.service';
import { PackageServiceService } from '../../service/package/package-service.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { LessonModel } from '../../ClassModel/LessonModel';
import { WebSocketServiceService } from '../../service/web-socket-service.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { WebSocketCommunicationDataMap } from '../../ClassModel/MapObject/WebSocketCommunicationDataMap';
import { NotificationServisceService } from '../../service/notification/notification-service.service';


/*
If changing lesson's day is equal to today then changing is 
not apply for today lessons and it's apply nextweek and upto lessons.
*/

@Component({
  selector: 'app-lesson-update',
  templateUrl: './lesson-update.component.html',
  styleUrls: ['./lesson-update.component.scss']
})
export class LessonUpdateComponent implements OnInit {


  timeSlotListData:TimeSlotModel[]=[];
  packageListData:PackageModel[]=[];
  pathListData:Path[]=[];
  instructorListData:InstructorMap[]=[];

  dayListData:any[] = [];

  errorMessage;

  //default  Variable value
  
  selectDayName;//name
  selectDay;//id

  selectTimeSlot:TimeSlotModel;
  selectPath:Path;
  selectInstructor:InstructorMap;
  selectPackage:PackageModel;
  selectTransmission=1;
  numStudent;

  //new Update  Variable value
  updateDay;
  updateTimeSlot:TimeSlotModel;
  updatePath:Path;
  updateInstructor:InstructorMap;
  updateNumStudent;

  //error message of form variable
  errorUpdateDay;
  errorUpdateTimeSlot;
  errorUpdatePath;
  errorUpdateInstructor;
  errorUpdatePackage;
  errorUpdateNumStudent;

  type:Number;
  lessonId;
  lessonData:LessonModel;
  
  isdisableInstructor=true;
  isShowLessonSet=false;

  constructor(
    private router:Router,
    private timeTableService:TimeTableServiceService,
    private route:ActivatedRoute,
    private notificationService:NotificationServisceService
  ) { }

  ngOnInit() {

    this.lessonId=this.route.snapshot.params['id'];//get lesson id by url
    this.type=this.route.snapshot.params['type'];//0:From Deactivate Component / 1:From Update Component
    
    this.getLesson(this.lessonId);
  }

  //get Lesson Details
  getLesson(lessonId){
    this.timeTableService.getLesson(lessonId).subscribe(
      response => {
          this.lessonData=response;
          
          this.selectTimeSlot=this.lessonData.timeSlotId;
          this.updateTimeSlot=this.lessonData.timeSlotId;

          this.selectPath=this.lessonData.pathId;
          this.updatePath=this.lessonData.pathId;

          this.selectPackage=this.lessonData.packageId;
          
          this.selectDay=this.lessonData.day;
          this.selectDayName=this.getDayName(this.selectDay);
          this.updateDay=this.lessonData.day;
          this.createDayList(this.lessonData.day);

          this.numStudent=this.lessonData.numStu;
          this.updateNumStudent=this.lessonData.numStu;

          if(this.type==1){
            this.selectInstructor=new InstructorMap(this.lessonData.instructorId.instructorId,this.lessonData.instructorId.staffId.name)
            this.updateInstructor=this.selectInstructor;
          }
          this.showInstructor();

          this.timeSlotList();
          this.pathList();

          this.isShowLessonSet=true;
         
      },
      error => {
          console.log(error);
          this.handleErrorResponse(error);
      }
    )
  }

  //get time Slot Details
  timeSlotList(){
      this.timeTableService.getTimeSlotList().subscribe(
        response => {
           
            response.forEach(element => {
              if(element.timeSlotId != this.selectTimeSlot.timeSlotId){
                 this.timeSlotListData.push(element);
              }
            });
           
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
    
        response.forEach(element => {
          if(element.pathId != this.selectPath.pathId){
            this.pathListData.push(element);
          }
        });
        
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

    this.errorUpdateDay="";
    this.errorUpdateTimeSlot="";
    this.errorUpdatePath="";
    this.errorUpdateInstructor="";
    this.errorUpdateNumStudent="";

    if(this.updateDay == null){
        this.errorUpdateDay="Day should be selected.";
        errorFlag=true;
    }
    if(this.updateTimeSlot == null){
        this.errorUpdateTimeSlot="Time should be selected.";
        errorFlag=true;
    }
    if(this.updatePath == null){
      this.errorUpdatePath="Path should be selected.";
      errorFlag=true;
    }
    if(this.updateInstructor == null){
      this.errorUpdateInstructor="Instructor should be selected.";
      errorFlag=true;
    }
    if(this.updateNumStudent == null){
      this.errorUpdateNumStudent="Insert valid input.";
      errorFlag=true;
    }

    if(!errorFlag){
      this.timeTableService.updateLesson(this.lessonData.lessonId,this.type,this.updateDay,this.updateTimeSlot.timeSlotId,this.updatePath.pathId,this.updateInstructor.instructorId,this.updateNumStudent).subscribe(
       response => {
        
        //change inform to notificationSerivce
        let data = new WebSocketCommunicationDataMap([0,0,0,1,1]);
        this.notificationService.notifyChange(data);

        Swal.fire({
          position: 'center',
          type: 'success',
          title: 'Update Successful',
          showConfirmButton: false,
          timer: 3000
        });

        this.router.navigate(['time-table'])
       },
       error => {
        console.log(error);
        this.handleErrorResponse(error);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: "Update Not Completed.",
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

  

  showInstructor(){
    
    this.isdisableInstructor=true;
    if( this.updateDay!=null && this.selectPackage!=null && this.updateTimeSlot!=null && this.updatePath!=null){
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
        this.timeTableService.getRelevantInstructorsList(this.updateDay,this.selectPackage.packageId,this.updateTimeSlot.timeSlotId,this.updatePath.pathId,transmission).subscribe(
          response => {

              this.instructorListData=[];
              if(this.type == 1){
                response.forEach(element => {
                  if(element.instructorId != this.selectInstructor.instructorId){
                    this.instructorListData.push(element);
                  }
                });
              }else{
                this.instructorListData=response;
              }
            
              if(this.type==0){
                if(this.instructorListData.length>0 ){
                  this.isdisableInstructor=false;
                }
              }else{
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

  getDayName(i){
    if(i==0){
      return "Sunday";
    }else if(i==1){
      return "Monday";
    }else if(i==2){
      return "Tuesday"
    }else if( i==3){
      return "Wednesday"
    }else if( i==4 ){
      return "Thursday"
    }else if( i==5 ){
      return "Friday";
    }else if( i==6 ){
      return "Saturday"
    }
  }

  createDayList(dayId){
    for(let i=0 ; i<7 ; i++){
      if(i != dayId){
          this.dayListData.push({id:i ,name:this.getDayName(i)})
      }
    }
  }

}
