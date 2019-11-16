import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as CanvasJS from '../../../assets/js/canvasjs.min';
import { LessonDayFeedbackChartDataMap } from '../../ClassModel/MapObject/LessonDayFeedbackChartDataMap';
import { LessonBookingService } from '../../service/LessonBooking/lesson-booking.service';

@Component({
  selector: 'app-trial-lesson-day-feedback-chart',
  templateUrl: './trial-lesson-day-feedback-chart.component.html',
  styleUrls: ['./trial-lesson-day-feedback-chart.component.scss']
})
export class TrialLessonDayFeedbackChartComponent implements OnInit {

  @Input() packageId;
  @Input() packageTitle;
  @Input() transmission;

  transmissionType;

  morningChartData:LessonDayFeedbackChartDataMap[];
  eveningChartData:LessonDayFeedbackChartDataMap[];

  constructor(
    public activeModal: NgbActiveModal,
    public lessonBookingService:LessonBookingService
  ) { }

  ngOnInit() {

    this.lessonBookingService.lessonFeedbackChartData(this.packageId,this.transmission,1).subscribe(
      response => {
        this.morningChartData=response;
        this.morningChart();
      },
      error => {
        console.log(error);
      }
    );

    this.lessonBookingService.lessonFeedbackChartData(this.packageId,this.transmission,2).subscribe(
      response => {
        this.eveningChartData=response;
        this.eveningChart();
      },
      error => {
        console.log(error);
      }
    );

    if(this.transmission==1){
      this.transmissionType="Manual";
    }else{
      this.transmissionType="Auto";
    }  
  }

  morningChart(){
    var chart = new CanvasJS.Chart("chartContainer1", {
      theme: "dark2", // "light2", "dark1", "dark2"
      animationEnabled: false, // change to true		
      title:{
        text: "Morning Time(8.00 am - 12.00 pm)"
      },
      data: [
      {
        // Change type to "bar", "area", "spline", "pie",etc.
        type: "column",
        dataPoints: [
          { label: "Monday",  y: this.morningChartData[1].count , color:'#ADD8E6'},
          { label: "Tuesday", y: this.morningChartData[2].count , color:'#ADD8E6' },
          { label: "Wednesday", y: this.morningChartData[3].count , color:'#ADD8E6' },
          { label: "Thursday",  y: this.morningChartData[4].count , color:'#ADD8E6' },
          { label: "Friday",  y: this.morningChartData[5].count , color:'#ADD8E6' },
          { label: "Saturday",  y: this.morningChartData[6].count , color:'#ADD8E6' },
          { label: "Sunday",  y: this.morningChartData[0].count , color:'#ADD8E6' }
        ]
      }
      ]
    });
    chart.render();
  }

  eveningChart(){
    var chart = new CanvasJS.Chart("chartContainer2", {
      theme: "dark2", // "light2", "dark1", "dark2"
      animationEnabled: false, // change to true		
      title:{
        text: "Evening Time(12.00 pm - 6.00 pm)"
      },
      data: [
      {
        // Change type to "bar", "area", "spline", "pie",etc.
        type: "column",
        dataPoints: [
          { label: "Monday",  y: this.eveningChartData[1].count , color:'#ADD8E6'},
          { label: "Tuesday", y: this.eveningChartData[2].count , color:'#ADD8E6' },
          { label: "Wednesday", y: this.eveningChartData[3].count , color:'#ADD8E6' },
          { label: "Thursday",  y: this.eveningChartData[4].count , color:'#ADD8E6' },
          { label: "Friday",  y: this.eveningChartData[5].count , color:'#ADD8E6' },
          { label: "Saturday",  y: this.eveningChartData[6].count , color:'#ADD8E6' },
          { label: "Sunday",  y: this.eveningChartData[0].count , color:'#ADD8E6' }
        ]
      }
      ]
    });
    chart.render();
  }
}


