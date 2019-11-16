import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrialLessonBookComponent } from '../trial-lesson-book/trial-lesson-book.component';
import { LessonBookingService } from '../../service/LessonBooking/lesson-booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-trial-lesson-day-feedback',
  templateUrl: './trial-lesson-day-feedback.component.html',
  styleUrls: ['./trial-lesson-day-feedback.component.scss']
})
export class TrialLessonDayFeedbackComponent implements OnInit {

  packageId;
  titleOfPackage;
  userId;

  day1;
  day2;

  time1;
  time2;

  errorMsg;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private lessonBookingService:LessonBookingService
  ) { }

  ngOnInit() {
    this.packageId=this.route.snapshot.params['packageId'];
    this.userId=this.route.snapshot.params['userId'];
    this.titleOfPackage=this.route.snapshot.params['packageTitle'];

    if(this.packageId==null || this.userId==null){
        this.router.navigate(['/']);
    }
  }

  save(){
    if(this.time1!=null && this.time2!=null && this.day1!=null && this.day2!=null){
        if( (this.day1==this.day2 && this.time1==this.time2) ){
          this.errorMsg="Don't insert same inputs for both forms.";
        }else{
          this.lessonBookingService.lessonDayFeedback(this.userId,this.packageId,this.day1,this.time1,this.day2,this.time2).subscribe(
            response => {
              console.log(response);
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Submission Successful.',
                showConfirmButton: false,
                timer: 2000
              });
            },
            error => {
              console.log(error);
              Swal.fire({
                position: 'center',
                type: 'error',
                title: 'Submission Not Successful.',
                showConfirmButton: false,
                timer: 2000
              });
            }
          );
        }
    }else{
      this.errorMsg="Complete all and submit";
    }
  }

  closeMsg(){
    this.errorMsg="";
  }

}
