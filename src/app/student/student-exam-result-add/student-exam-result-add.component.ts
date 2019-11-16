import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from '../../service/student/student-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { DatePipe } from '@angular/common';
import { ExamList } from '../../adminStaff/admin-staff-student-dash-board/admin-staff-student-dash-board.component';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-exam-result-add',
  templateUrl: './student-exam-result-add.component.html',
  styleUrls: ['./student-exam-result-add.component.scss']
})
export class StudentExamResultAddComponent implements OnInit {

  errorMessage;
  examDate:Date;//writtenExam Date
  trialDate:Date;//trialExam Date
  errorWrittenDateMessage="";
  errorTrialDateMessage="";

  writtenExamList:ExamList[]=[];
  unSelectWrittenExamList=[];
  isWrittenExamDate=false;
  selectWrittenExam=false;
  writtenExamListCount=0;

  trialExamList:ExamList[]=[];
  unSelectTrialExamList=[];
  isTrialExamDate=false;
  selectTrialExam=false;
  trialExamListCount=0;
 
  constructor(
    private studentService:StudentServiceService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
  }

  //Wriiten Exam Section

  getWrittenExamData(){
    this.writtenExamListCount=0;
    if(this.examDate == null){
      this.errorWrittenDateMessage="Insert Valid Date";
    }else{
      this.errorWrittenDateMessage=null;
      let localdate=this.datePipe.transform(this.examDate, 'yyyy-MM-dd')
      this.studentService.studentExamList(localdate).subscribe(
        response => {
          this.writtenExamList=response;
          if(this.writtenExamList.length>0){
            this.writtenExamListCount=this.writtenExamList.length;
            this.isWrittenExamDate=true;
          }else{
            this.selectWrittenExam=true;
            this.isWrittenExamDate=false;
          }
        },
        error => {
          console.log(error);
          this.handleErrorResponse(error);
        } 
      )
    }
   
  }

  //countCheck for written exam
  countCheckWrittenExam(nic){
      
          let flag=true;
          let i=0;
          this.unSelectWrittenExamList.forEach(element => {
            if(element===nic){
              flag=false;
               this.writtenExamListCount+=1;
               this.unSelectWrittenExamList.splice(i, 1);
            }
            i++;
          });
          if(flag){
            this.writtenExamListCount-=1;
            this.unSelectWrittenExamList.push(nic);
          }

          //console.log("count:"+this.writtenExamListCount+"  list:"+this.unSelectWrittenExamList)
  }

  //submit wriiten exam result
  submitWrittenExamResult(){
    //console.log("date:"+this.examDate+"  "+this.writtenExamListCount);
    let notPassStudent=this.writtenExamList.length-this.writtenExamListCount;
    this.studentService.submitWrittenExamResult(this.examDate,this.writtenExamListCount,notPassStudent).subscribe(
      response =>{
          //console.log(response);
          Swal.fire('Submission is Successful')
      },
      error =>{
          console.log(error);
          this.handleErrorResponse(error);
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Submission is not Successful!',
            footer: 'Something bad happened, please try again later.'
          })
      }
    )
  }

  //Wriiten Exam Section Finish

  //Trial Exam Section

   getTrialExamData(){
    this.trialExamListCount=0;
    if(this.trialDate == null){
      this.errorTrialDateMessage="Insert Valid Date";
    }else{
      this.errorTrialDateMessage=null;
      let localdate=this.datePipe.transform(this.trialDate, 'yyyy-MM-dd')
      this.studentService.studentTrialList(localdate).subscribe(
        response => {
          //console.log(response)
          this.trialExamList=response;
          if(this.trialExamList.length>0){
            this.trialExamListCount=this.trialExamList.length;
            this.isTrialExamDate=true;
          }else{
            this.selectTrialExam=true;
            this.isTrialExamDate=false;
          }
        },
        error => {
          console.log(error);
          this.handleErrorResponse(error);
        } 
      )
    }
   
  }

  //countCheck for trial exam
  countCheckTrialExam(nic){
      
          let flag=true;
          let i=0;
          this.unSelectTrialExamList.forEach(element => {
            if(element===nic){
              flag=false;
               this.trialExamListCount+=1;
               this.unSelectTrialExamList.splice(i, 1);
            }
            i++;
          });
          if(flag){
            this.trialExamListCount-=1;
            this.unSelectTrialExamList.push(nic);
          }

          //console.log("count:"+this.trialExamListCount+"  list:"+this.unSelectTrialExamList)
  }

  //submit trial exam result
  submitTrialExamResult(){
    //console.log("date:"+this.trialDate+"  "+this.trialExamListCount);
    let notPassStudent=this.trialExamList.length-this.trialExamListCount;
    this.studentService.submitTrialExamResult(this.trialDate,this.trialExamListCount,notPassStudent).subscribe(
      response =>{
          //console.log(response);
          Swal.fire('Submission is Successful')
      },
      error =>{
          console.log(error);
          this.handleErrorResponse(error);
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Submission is not Successful!',
            footer: 'Something bad happened, please try again later.'
          })
      }
    )
  }

  //Trial Exam Section Finish

  //error handling
  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError(); 
    this.errorMessage=httpError.ErrorResponse(error);
    console.log(this.errorMessage);
  };

  closeWrittenExamTable(){
    this.isWrittenExamDate=false;
  }

  closeTrialExamTable(){
    this.isTrialExamDate=false;
  }
}
