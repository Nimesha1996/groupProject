import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import { InstructorServiceService } from '../../service/instructor/instructor-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { StudentPractricalChartDataMap } from '../../ClassModel/MapObject/StudentPractricalChartDataMap';

@Component({
  selector: 'app-practrical-lesson-chart-student',
  templateUrl: './practrical-lesson-chart-student.component.html',
  styleUrls: ['./practrical-lesson-chart-student.component.scss']
})
export class PractricalLessonChartStudentComponent implements OnInit {

  @Input() studentLessonId;
  @Input() studentName;
  studentChartData : StudentPractricalChartDataMap = new StudentPractricalChartDataMap('',0,0,0,0,new Date(),0);

  constructor(
    public activeModal: NgbActiveModal,
    private instructroService : InstructorServiceService
    ) { }

  ngOnInit() {
  
    this.instructroService.getPractricalLessonChartStudentData(this.studentLessonId).subscribe(
      response => {
        this.studentChartData=response;
        

        //if name is empty , then request come by studentAccount
        if(this.studentName == ''){
              //chart Initialize
              let chart = new CanvasJS.Chart("chartContainer", {
                theme: "dark",
                animationEnabled: true,
                exportEnabled: true,
                // title:{
                //   text: "Student Practrical"
                // },
                data: [{
                  type: "pie",
                  showInLegend: true,
                  toolTipContent: "<b>{name}</b>: {y} (#percent%)",
                  indexLabel: "{name} - #percent%",
                  dataPoints: [
                    { y: this.studentChartData.completeLesson, name: "Complete Lesson" ,color: '#90ee90'},
                    { y: this.studentChartData.notCompleteLesson, name: "Not Complete Lesson" , color:'#ffcccb   '},
                    { y: this.studentChartData.remainLesson, name: "Remain Lesson" ,color:'#ADD8E6' },
                    { y: this.studentChartData.bookLesson, name: "Book Lesson" ,color:'#FFCF9E'}
                  ]
                }]
              });
                
              chart.render();
        }else{
              //chart Initialize
              let chart = new CanvasJS.Chart("chartContainer", {
                theme: "dark",
                animationEnabled: true,
                exportEnabled: true,
                // title:{
                //   text: "Student Practrical"
                // },
                data: [{
                  type: "pie",
                  showInLegend: true,
                  toolTipContent: "<b>{name}</b>: {y} (#percent%)",
                  indexLabel: "{name} - #percent%",
                  dataPoints: [
                    { y: this.studentChartData.completeLesson, name: "Complete Lesson" ,color: '#90ee90'},
                    { y: this.studentChartData.notCompleteLesson, name: "Not Complete Lesson" , color:'#ffcccb   '},
                    { y: ( (+this.studentChartData.remainLesson) + (+this.studentChartData.bookLesson)), name: "Remain Lesson" ,color:'#ADD8E6' }
                  ]
                }]
              });
                
              chart.render();
        }
    
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );   
  }


  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  }
}
