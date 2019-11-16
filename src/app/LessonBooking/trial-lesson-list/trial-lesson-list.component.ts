import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PackageModel } from '../../ClassModel/PackageModel';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { LessonBookingService } from '../../service/LessonBooking/lesson-booking.service';
import { StudentLessonModel } from '../../ClassModel/StudentLessonModel';
import { PathMapComponent } from '../../timeTable/path-map/path-map.component';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PractricalLessonChartStudentComponent } from '../../instructor/practrical-lesson-chart-student/practrical-lesson-chart-student.component';

@Component({
  selector: 'app-trial-lesson-list',
  templateUrl: './trial-lesson-list.component.html',
  styleUrls: ['./trial-lesson-list.component.scss'],
  providers:[PathMapComponent]
})
export class TrialLessonListComponent implements OnInit {

  userId;
  studentPackages:PackageModel[];
  selectPackageTitle;
  errorMessage;
  successMessage;

  selectPackageBookLesson:StudentLessonModel[]=[];
  previousLesson:StudentLessonModel[]=[];
  futureLesson:StudentLessonModel[]=[];

  totalLesson;
  reservedLesson;
  remainLesson;
  transmission;

  isBookLeeson=false;

  currentDate=new Date();
  currentYear=this.currentDate.getFullYear();
  currentMonth=this.currentDate.getMonth()+1;
  currentDay=this.currentDate.getDate();

    
  currentTimeHour=new Date().getHours();
  currentTImeMinute=new Date().getMinutes();

  idOfSelectPackage;
  titleOfSelectPackage;

  isFutureLesson=false;
  isPreviousLesson=false;
  isSelectPackage=false;

  constructor(
    private lessonBookService:LessonBookingService,
    private pathMap:PathMapComponent,
    private router:Router,
    private route:ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.userId=sessionStorage.getItem('userId');
    if(this.userId == null){
        this.router.navigate(['/']);
    }

    this.idOfSelectPackage=this.route.snapshot.params['package'];
    this.titleOfSelectPackage=this.route.snapshot.params['title'];
  
    if(this.idOfSelectPackage != " " && this.titleOfSelectPackage!=" "){
      this.bookLessonDetails(this.idOfSelectPackage,this.titleOfSelectPackage);
    }

    this.studentPackageList();
    
  }

   //get Student following packages Id
  studentPackageList(){
    this.lessonBookService.getStudentPackages(this.userId).subscribe(
      response => {
          this.studentPackages=response;
          if(this.studentPackages.length < 1){
            this.errorMessage="Student Not Following Any Packages";
          }       
      },
      error =>{
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  bookLessonDetails(selectPackageId,title){
   
    this.idOfSelectPackage=selectPackageId;
    this.titleOfSelectPackage=title;

    this.isSelectPackage=true;
    this.isBookLeeson=false;
    this.previousLesson=[];
    this.futureLesson=[];

    this.selectPackageTitle=title;
    this.errorMessage="";
    this.lessonBookService.getBookLessonDetails(this.userId,selectPackageId).subscribe(
      response => {
        this.selectPackageBookLesson=response;
        if(this.selectPackageBookLesson.length == 0){
          this.errorMessage="You Are Not Booked(Reserved) Any Lessons Yet.";
        }else{
          this.divideLesson(this.selectPackageBookLesson);
        }
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  //select what are the lesson will held in future and past
  divideLesson(bookLesson:StudentLessonModel[]){

    this.isBookLeeson=true;
    this.isPreviousLesson=false;
    this.isFutureLesson=false;

    let transmission=bookLesson[0].lessonId.transmission;
    if(transmission==1){
      this.transmission="Manual";
      //this.totalLesson = bookLesson[0].lessonId.packageId.autoLes;
      this.totalLesson = bookLesson[0].lessonId.packageId.manualLes;
    }else{
      this.transmission="Auto";
      //this.totalLesson = bookLesson[1].lessonId.packageId.manualLes;
      this.totalLesson = bookLesson[1].lessonId.packageId.autoLes;
    }
    this.reservedLesson=bookLesson.length;
    this.remainLesson=this.totalLesson-this.reservedLesson; 

    bookLesson.forEach(element => {
      
      let date=new Date(element.date);
      let year = date.getFullYear();
      let month=date.getMonth()+1;
      let day=date.getDate();

      let startTime=element.lessonId.timeSlotId.startTime;
      let hour=+(startTime[0]+startTime[1]);
      let minute=+(startTime[3]+startTime[4]);


      if(this.currentYear == year){
        if(this.currentMonth == month){
          if(this.currentDay == day ){

              if(this.currentTimeHour == hour){
                if(this.currentTImeMinute > minute){
                  this.previousLesson.push(element);
                }else{
                  this.futureLesson.push(element);
                }
              }else if(this.currentTimeHour > hour){
                this.previousLesson.push(element);
              }else{
                this.futureLesson.push(element);
              }

          }else if(this.currentDay > day){
            this.previousLesson.push(element);
          }else{
            this.futureLesson.push(element);
          }
        }else if(this.currentMonth > month){
          this.previousLesson.push(element);
        }else{
          this.futureLesson.push(element);
        }
      }else if(this.currentYear > year){
        this.previousLesson.push(element);
      }else{
        this.futureLesson.push(element);
      }
    });

    if(this.futureLesson.length>0){
      this.isFutureLesson=true;
    }
    if(this.previousLesson.length>0){
      this.isPreviousLesson=true;
    }

  }

  //cancel booking
  /*Student can cacel the booking 
    lesson before 1 day.
  */
  cacelBooking(studentLesson:StudentLessonModel){
    let isAbleToCancelBooking=true;

    let lessonDate=new  Date(studentLesson.date);
    let year=lessonDate.getFullYear();
    let month=lessonDate.getMonth()+1;
    let day=lessonDate.getDate();

    if(this.currentYear == year){
      if(this.currentMonth == month){
        if(this.currentDay == day){
          isAbleToCancelBooking=false;
        }else{
          let dateGap=day-this.currentDay;
          if(dateGap==1){
            isAbleToCancelBooking=false;
          }
        }
      }
    }

    if(isAbleToCancelBooking){
      this.lessonBookService.cancelBooking(studentLesson.studentLessonId).subscribe(
        response => {
        this.bookLessonDetails(this.idOfSelectPackage,this.titleOfSelectPackage);
         Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Reserved Lesson Succefully Cancelled.',
            showConfirmButton: false,
            timer: 2000
          })
        },
        error => {
          Swal.fire({
            position: 'top-end',
            type: 'error',
            title: 'Reserved Lesson Not Successfully Canceled.Please Try Again Later',
            showConfirmButton: false,
            timer: 3000
          })
          console.log(error);
          this.handleErrorResponse(error);
        }
      )
    }else{
      this.errorMessage="You Can't Cancel the Booking.(You Should Cancel the Booking Before One Day Of the Trial Date";
    }
  }

  studentChart(){
    //getStudentLessonId and StudentName
    const modalRef = this.modalService.open(PractricalLessonChartStudentComponent,{ centered: true });
    modalRef.componentInstance.studentLessonId = this.selectPackageBookLesson[0].studentLessonId;
    modalRef.componentInstance.studentName = "";
  }

  closeMsg(){
    this.errorMessage="";
  }

  googleMap(path){
    this.pathMap.googleMap(path,1);
  }

  trialLessonDayFeedback(){
    this.router.navigate(['trial-lesson-day-feedback',this.userId,this.idOfSelectPackage,this.titleOfSelectPackage]);
  }

  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
    }

}
