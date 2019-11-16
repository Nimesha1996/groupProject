import { Component, OnInit } from '@angular/core';
import { TimeTableServiceService } from '../../service/TimeTable/time-table-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { TimeSlotModel } from '../../ClassModel/TimeSlotModel';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { TimeTableValidation } from '../../Shared/validation/timetable-validation/time-table-validation';
import Swal from 'sweetalert2';
import { Time } from '@angular/common';

@Component({
  selector: 'app-time-slot',
  templateUrl: './time-slot.component.html',
  styleUrls: ['./time-slot.component.scss']
})
export class TimeSlotComponent implements OnInit {

  errorMessage;
  httpError:HttpError;

  timeSlotListData:TimeSlotModel[]=[];

  //update Variables
  isUpdateVariable=false;
  updateTimeSlot:TimeSlotModel;
  errorFrom;
  errorTo;


  //add new timeSlot
  isAddTimeSlot=false;
  newTimeSlot = new TimeSlotModel(-1,new Date(),new Date());
  errorFromNew;
  errorToNew;

  //validation
  timeTableValidation = new TimeTableValidation();

  constructor(
    private timeTableService:TimeTableServiceService
  ) { }

  ngOnInit() {
    this.timeSlotList();
  }

  //get time slot data
  timeSlotList(){
    this.timeTableService.getTimeSlotList().subscribe(
      response => {
          this.timeSlotListData=response;
      },
      error =>{
          console.log(error);
          this.handleErrorResponse(error);
      }
    );
  }

  //update time slot data


  isUpdate(timeSlot:TimeSlotModel){
    this.errorFrom="";
    this.errorTo="";
    this.isUpdateVariable=true;
    this.updateTimeSlot=new TimeSlotModel(timeSlot.timeSlotId, timeSlot.startTime, timeSlot.finishTime);
  }

  updateConfirm(){
    this.errorFrom="";
    this.errorTo="";
    if(this.timeTableValidation.isValidTimeSlot(this.updateTimeSlot.startTime)){ 
      if(this.timeTableValidation.isValidTimeSlot(this.updateTimeSlot.finishTime)){
        this.timeTableService.updateTimeSlot(this.updateTimeSlot).subscribe(
          response => {
              console.log(response);
              Swal.fire('Update is Completed.');
              this.timeSlotListData=[];
              this.timeSlotList();
              this.isUpdateVariable=false;
          },
          error => {
            console.log(error);
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Update is not Successful!',
              footer: 'Something bad happened, please try again later.'
            });
            this.handleErrorResponse(error);
          }
        )
      }else{
        this.errorTo="Insert Valid Time(To)";
      }
    }else{
      this.errorFrom="Insert Valid Time(From)";
    }
  }
   
  // Finish update time slot data 

  // Add new Time Slot Section
  addTimeSlot(){
    this.isAddTimeSlot=true;
    this.errorFromNew="";
    this.errorToNew="";
  }

  saveConfirm(){
      this.errorFromNew="";
      this.errorToNew="";
      if(this.timeTableValidation.isValidTimeSlot(this.newTimeSlot.startTime) && this.newTimeSlot.startTime.getDate==null){
        if(this.timeTableValidation.isValidTimeSlot(this.newTimeSlot.finishTime)  && this.newTimeSlot.finishTime.getDate==null){
            this.timeTableService.addTimeSlot(this.newTimeSlot).subscribe(
              response => {
                  //console.log(response);
                  Swal.fire('Save is Completed.');
                  this.timeSlotListData=[];
                  this.timeSlotList();
                  this.isAddTimeSlot=false;
              },
              error => {
                console.log(error);
                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Save is not Successful!',
                  footer: 'Something bad happened, please try again later.'
                });
                this.handleErrorResponse(error);
              }
            )
        }else{
          this.errorToNew="Insert Valid Time(To)";
        }
      }else{
        this.errorFromNew="Insert Valid Time(From)";
      }
  }
  //Finish Add new Time Slot Section

  // Delete Time Slot Section
  delete(timeSlot:TimeSlotModel){
    Swal.fire({
      title: 'Are you sure?',
      text: "Delete Time Slot details and Relevant Lesson Details Also Deleted.!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        
        //Call to API
        this.timeTableService.deleteTimeSlot(timeSlot.timeSlotId).subscribe(
          response => {
            this.timeSlotList();
            Swal.fire(
              'Deleted!',
              'Time Slot Record has been deleted.',
              'success'
            )
          },
          error => {
            console.log(error);
            this.handleErrorResponse(error);
            Swal.fire({
              type: 'error',
              title: 'Oops...',
              text: 'Delete is not Successfull!',
              footer: 'Something bad happened, please try again later.'
            })
          }
           
        )
      }
    })
  }
  // Finish Delete Time Slot Section

  //error handling
  private handleErrorResponse(error: HttpErrorResponse) {
    this.errorMessage=this.httpError.ErrorResponse(error);
    console.log(this.errorMessage);
  };

  //button(close)
  close(){
    this.isUpdateVariable=false;
  }

  closeAddTimeSlot(){
    this.isAddTimeSlot=false;
  }

}
