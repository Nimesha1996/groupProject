import { Component, OnInit } from '@angular/core';
import { InstructorServiceService } from '../../service/instructor/instructor-service.service';
import { Router } from '@angular/router';
import { TimeTableDataList } from '../../ClassModel/MapObject/TimeTableDataList';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';



@Component({
  selector: 'app-instructor-time-table',
  templateUrl: './instructor-time-table.component.html',
  styleUrls: ['./instructor-time-table.component.scss']
})
export class InstructorTimeTableComponent implements OnInit {

  userId;
  instructorLessonList:TimeTableDataList[]=[];
  rowSpanLength=[];
  message;


  constructor(
    private instructorService:InstructorServiceService,
    private router:Router
  ) { }

  ngOnInit() {
    this.userId=sessionStorage.getItem('userId');
    if(this.userId==null){
      this.router.navigate(['/']);
    }
    this.getInstructorLesson();
  }

  //get instructor's lesson details
  getInstructorLesson(){
    this.instructorService.getInstructorLesson(this.userId).subscribe(
      response => {
        this.instructorLessonList=response;
        if(this.instructorLessonList.length == 0){
          this.message="You haven't any lesson yet."
        }else{
          this.instructorLessonList.forEach(element => {
            let lengthRow=0;
            element.numStuData.forEach( x => {
              lengthRow+=x.length;
            });
            this.rowSpanLength.push(lengthRow);
          });
        }
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }


  assignStudent(lessonId,day,timeSlot){
    this.router.navigate(['lesson-assign-student/',lessonId,day,timeSlot]);
  }

  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  }

}
