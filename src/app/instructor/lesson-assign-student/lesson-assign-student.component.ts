import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { InstructorServiceService } from '../../service/instructor/instructor-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { LessonAssingStudentMap } from '../../ClassModel/MapObject/LessonAssignStudentMap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PractricalLessonChartStudentComponent } from '../practrical-lesson-chart-student/practrical-lesson-chart-student.component';

@Component({
  selector: 'app-lesson-assign-student',
  templateUrl: './lesson-assign-student.component.html',
  styleUrls: ['./lesson-assign-student.component.scss']
})
export class LessonAssignStudentComponent implements OnInit {

  userId;
  lessonId;
  assingStudentList:LessonAssingStudentMap[]=[];
  lessonDate;
  lessonDay;
  lessonTimeSlot;

  isAnyStudent=false;

  warningMessage;
  errorMessage;

  // Student Char Data
  public gradientStroke;
  public chartColor;
  public canvas : any;
  public ctx;

  

  public gradientChartOptionsConfiguration: any;

  public barChartType;
  public barChartData:Array<any>;
  public barChartOptions:any;
  public barChartLabels:Array<any>;
  public barChartColors:Array<any>

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private instructorService:InstructorServiceService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.lessonId=this.route.snapshot.params['lessonId'];
    this.lessonDay=this.route.snapshot.params['day'];
    this.lessonTimeSlot=this.route.snapshot.params['timeSlot'];
    this.userId=sessionStorage.getItem('userId');

    if(this.lessonId==null || this.userId==null || this.lessonDay==null || this.lessonTimeSlot==null){
      this.router.navigate(['/']);
    }

    this.getAssingStudent();
  }

  //get assing student for specific lesson
  getAssingStudent(){
    this.isAnyStudent=false;
    this.instructorService.getAssignStudent(this.userId,this.lessonId).subscribe(
      response => {
        this.assingStudentList=response;
        if(this.assingStudentList.length == 0){
          this.warningMessage="There is no any student yet.";
        }else{
          this.isAnyStudent=true;
          this.setLessonDate();
        }
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  setLessonDate(){
    this.instructorService.getLessonDate(this.userId,this.lessonId).subscribe(
      response => {
        this.lessonDate=response;
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  //Mark the student's practrical ,Whether lesson complete or not
  // mark 1-->complete 2-->notcomplete
  markStudentLesson(studentLessonId,mark){
    if(this.isCurrentDateAndTime()){
      this.instructorService.markStudentLesson(studentLessonId,mark).subscribe(
        response => {
        this.getAssingStudent();
        },
        error => {
          console.log(error);
          this.handleErrorResponse(error);
        }
      );
    }else{
      this.errorMessage="Can't Update Student Practrical Data.(Update Student's Practrical Mark Correct Date & Time)";
    }
  }

  //Student Practrical result should be insert on date 
  isCurrentDateAndTime(){
    let lessonDate = new Date(this.lessonDate);
    let lessonDay = lessonDate.getDay();

    let currentDate = new Date();
    let currentDay = currentDate.getDay();

    let lessonTimeHour = +(this.lessonTimeSlot[0]+this.lessonTimeSlot[1])
    let lessonTimeMinute = +(this.lessonTimeSlot[3]+this.lessonTimeSlot[4])

    let currentTimeHour = currentDate.getHours();
    let currentTimeMinute = currentDate.getMinutes();

    if( (currentDay == lessonDay)){
      if(lessonTimeHour<currentTimeHour){
        return true;
      }else if(lessonTimeHour==currentTimeHour){
        if(lessonTimeMinute<currentTimeMinute){
          return true;
        }
      }
    }
    return false;
  }

  studentChart(studentLessonId,studentName){
    const modalRef = this.modalService.open(PractricalLessonChartStudentComponent,{ centered: true });
    modalRef.componentInstance.studentLessonId = studentLessonId;
    modalRef.componentInstance.studentName = studentName;
  }

  /*
  type 1-->Warning Message , 2--> Error Message
  */
  closeMsg(type){
    if(type==1){
      this.warningMessage="";
    }else{
      this.errorMessage="";
    }
  }

  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  }

}
