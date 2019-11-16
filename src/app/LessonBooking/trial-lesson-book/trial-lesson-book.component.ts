import { Component, OnInit } from '@angular/core';
import { StudentPackageModel } from '../../ClassModel/StudentPackageModel';
import { StudentServiceService } from '../../service/student/student-service.service';
import { LessonBookingService } from '../../service/LessonBooking/lesson-booking.service';
import { Router } from '@angular/router';
import { TimeSlotModel } from '../../ClassModel/TimeSlotModel';
import { TimeTableServiceService } from '../../service/TimeTable/time-table-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { LessonModel } from '../../ClassModel/LessonModel';
import { PathMapComponent } from '../../timeTable/path-map/path-map.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trial-lesson-book',
  templateUrl: './trial-lesson-book.component.html',
  styleUrls: ['./trial-lesson-book.component.scss'],
  providers:[PathMapComponent]
})
export class TrialLessonBookComponent implements OnInit {

  userId;
  studentPackageList:StudentPackageModel[];
  timeSlotList:TimeSlotModel[]=[];

  selectStudentPackage:StudentPackageModel;
  selectTimeSlot:TimeSlotModel;
  selectDay:Date;

  trialDate:Date;
  isAbleToBook=false;

  errorMessage;

  currentyear=new Date().getFullYear();
  currentMonth=new Date().getMonth()+1;
  currentDay=new Date().getDate();
  currentTimeHour=new Date().getHours();
  currentTImeMinute=new Date().getMinutes();

  trialYear;
  trialMonth;
  trialDay;

  isAvailableLesson:boolean=false;
  availableLesson:LessonModel=null;

  constructor(
    private lessonBookingService:LessonBookingService,
    private timeTableService:TimeTableServiceService,
    private pathMap:PathMapComponent,
    private router:Router,
  ) { }

  ngOnInit() {
    this.userId=sessionStorage.getItem('userId');
    (this.userId==null ? this.router.navigate(['/']) : "");

    this.getStudentPackageData();
    this.gettimeSlotData();
    this.getTrialDate();
  }

  //get Student following package data
  getStudentPackageData(){
    this.lessonBookingService.getStudentPackageData(this.userId).subscribe(
      response => {
        this.studentPackageList=response;
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    )
  }

  //get time Slot Details
  gettimeSlotData(){
    this.timeTableService.getTimeSlotList().subscribe(
      response => {
          this.timeSlotList=response;
      },
      error => {
          console.log(error);
          this.handleErrorResponse(error);
      }
    );
  }

  //get Available lesson
  getLesson(){
    this.isAvailableLesson=false;
    this.errorMessage="";
    if(this.validInput()){
        this.lessonBookingService.getAvailableLesson(this.selectDay,this.selectStudentPackage.studentPackageId,this.selectTimeSlot.timeSlotId).subscribe(
          response => {
            this.availableLesson=response;
            
            if(this.availableLesson.lessonId > 0){
              this.isAvailableLesson=true;
            }else if(this.availableLesson.lessonId == 0){
              this.errorMessage="No such a lesson.Please check time table and book the lesson."
            }else{
              this.errorMessage="No any available opertunity for this lesson."
            }
            console.log(this.availableLesson)
          },
          error => {
            console.log(error);
            this.handleErrorResponse(error);
          }
        )
    }
  }

  //get Student Trial Date
  getTrialDate(){
   
    this.lessonBookingService.getTrialDate(this.userId).subscribe(
      response => {
        if(response!=null){
    
          this.trialDate=response;
          
          this.trialYear=+(this.trialDate[0]+this.trialDate[1]+this.trialDate[2]+this.trialDate[3]);
          this.trialMonth=+(this.trialDate[5]+this.trialDate[6]);
          this.trialDay=+(this.trialDate[8]+this.trialDate[9]);
         
          if(this.currentyear == this.trialYear){
            if(this.currentMonth == this.trialMonth){
              if(this.currentDay <  this.trialDay){
                this.isAbleToBook=true;
              }else{
                this.errorMessage="Your Trail Examination Date is Over.You can't reserve trial lessons."
              }
            }else if(this.currentMonth < this.trialMonth){
              this.isAbleToBook=true;
            }else{
               this.errorMessage="Your Trail Examination Date is Over.You can't reserve trial lessons."
            }
          }else if(this.currentyear < this.trialYear){
            this.isAbleToBook=true;
          }else{
            this.errorMessage="Your Trail Examination Date is Over.You can't reserve trial lessons."
          }

        }else{
          this.errorMessage="You can't reserve lesson,Because your Trial Date not insert to the system.Please inform to learners staff";
        }
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    )
  }

  validInput(){
    
    if(this.selectStudentPackage!=null && this.selectDay!=null && this.selectTimeSlot!=null){
      
      let selectYear=new Date(this.selectDay).getFullYear();
      let selectMonth=new Date(this.selectDay).getMonth()+1;
      let selectDay=new Date(this.selectDay).getDate();
      let selectStartTimeHour=+(this.selectTimeSlot.startTime[0]+this.selectTimeSlot.startTime[1]);//+ :convert string to number
      let selectStartTimeMinute=+(this.selectTimeSlot.startTime[3]+this.selectTimeSlot.startTime[4]);

      //compare selectDay>currentDay
      let lowerBoundSelectDate=this.checkLowerBoundSelectDate(selectYear,selectMonth,selectDay,selectStartTimeHour,selectStartTimeMinute);
      
      //compare selectDay<trialDay
      let upperBoudSelectDate=this.checkUperBoundSelectDate(selectYear,selectMonth,selectDay);

      if(lowerBoundSelectDate && upperBoudSelectDate){
        return true;
      }
      return false;
    }
    return false;
  }

  //compare selectDay>currentDay
  checkLowerBoundSelectDate(selectYear,selectMonth,selectDay,selectStartTimeHour,selectStartTimeMinute){

    if(this.currentyear == selectYear){
      if(this.currentMonth == selectMonth){
        
        if(this.currentDay == selectDay){//current day validation

          if(this.currentTimeHour == selectStartTimeHour){
            
            if(selectStartTimeMinute>this.currentTImeMinute){
              let timeGapMinute=selectStartTimeMinute-this.currentTImeMinute;
              if(timeGapMinute < 30){
                this.errorMessage="You should reserve lesson before 30(Min) of the actual lesson held";
                return false;
              }
            }

          }else if(selectStartTimeHour<this.currentTimeHour){
            this.errorMessage="Select Valid Time Slot";
            return false;
          }else{
            let timeGapHour=selectStartTimeHour-this.currentTimeHour;
            if(timeGapHour==1){
                let timeGapMinute=(selectStartTimeMinute)+(60-this.currentTImeMinute);
                if(timeGapMinute < 30){
                  this.errorMessage="You should reserve lesson before 30(Min) of the actual lesson held";
                  return false;
                }
            }
          }

        }else if(this.currentDay>selectDay){
          this.errorMessage="Select Valid Date(Invalid Day)";
          return false;
        }else{
          //
        }
      }else if(this.currentMonth>selectMonth){
        this.errorMessage="Select Valid Date(Invalid Month)";
          return false;
      }else{
        //
      }
    }else if(this.currentyear>selectYear){
      this.errorMessage="Select Valid Date(Invalid Year)";
      return false;
    }else{
      //
    }
    return true;
  }

  checkUperBoundSelectDate(selectYear,selectMonth,selectDay){
    if(this.trialYear == selectYear){
      if(this.trialMonth == selectMonth){
        
        if(this.trialDay <= selectDay){
          this.errorMessage="Select Valid Date(Can't select date(day) beyond the trial date)";
          return false;
        }

      }else if(this.trialMonth < selectMonth){
        this.errorMessage="Select Valid Date(Can't select date(month) beyond the trial date)";
          return false;
      }else{
        //
      }
    }else if(this.trialYear<selectYear){
      this.errorMessage="Select Valid Date(Can't select date(year) beyond the trial date)";
      return false;
    }else{
      //
    }
    return true;
  }

  //save the selected booking lesson
  saveBooking(){
    this.lessonBookingService.saveBooking(this.availableLesson.lessonId,this.selectStudentPackage.studentPackageId,this.selectDay).subscribe(
      response => {
        
        
        if(response == 1){
          this.router.navigate(['trial-lesson-list',this.selectStudentPackage.packageId.packageId,this.selectStudentPackage.packageId.title]);
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Leeson Booking Success.',
            showConfirmButton: false,
            timer: 1500
          })
        }
        
        if(response == -2){
          this.errorMessage="You Already Book This Lesson Or You Booked Another Lesson In This Time Period .";
        }
        
        if(response == 0){
          this.errorMessage="You Can't Book Lesson.Because You Haven't Any Available Lesson Further.";
        }

        this.isAvailableLesson=false;

      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Booking Lesson Not Success!',
          footer: 'Please Try Again Later'
        });
      }
    )
  }


  googleMap(path){
    this.pathMap.googleMap(path,1);
  }

  closeMsg(){
    this.errorMessage="";
  }

  //error handling
 private handleErrorResponse(error: HttpErrorResponse) {
  let httpError = new HttpError();
  httpError.ErrorResponse(error);
  }
}
