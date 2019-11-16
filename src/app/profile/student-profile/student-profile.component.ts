import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from '../../service/student/student-service.service';
import { HttpError } from '../../Shared/httpError/HttpError';
import { HttpErrorResponse } from '@angular/common/http';
import { StudentModel } from '../../ClassModel/StudentModel';
import { UserValidation } from '../../Shared/validation/user-validation/user-validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  userId;
  studentName;

 studentData:StudentModel;

 errorName;
 errorAddress;
 errorNic;
 errorTel;
 errorEmail;
 errorPassword;

 //user Validation Instance
 userValidation = new UserValidation();

  constructor(
    private studentService :StudentServiceService
  ) { }

  ngOnInit() {
    this.userId=sessionStorage.getItem('userId');
    this.getStudent();
  }

  getStudent(){
    this.studentService.getStudentData(this.userId).subscribe(
      response => {
        this.studentData=response;
        this.studentName=this.studentData.name;
      },
      error => {
        console.log(error);
      }
    )
  }

  save(){
  
    this.errorName="";
    this.errorNic="";
    this.errorTel="";
    this.errorAddress="";
    this.errorEmail="";
    this.errorPassword="";

    //validate name
    if(this.studentData.name === ""){
      this.errorName="Name is mandatory";
    }

    //validate NIC
    if(this.studentData.nic === ""){
      this.errorNic="NIC number is mandatory ";
    }else if( !this.userValidation.isValidNicNumber(this.studentData.nic) ){
      this.errorNic="Enter Valid NIC Number";
    }

    //Valid Number
    if(this.studentData.tel===""){
      this.errorTel="Telephone number is mandatory";
    }else if( !this.userValidation.isValidTelNumber(this.studentData.tel) ){
      this.errorTel="Enter Valid Telephone Number ";
    }

    //valid address
    if( this.studentData.address === "" ){
      this.errorAddress="Address is mandatory ";
    }

    //valid email
    if( this.studentData.userId.email === "" ){
      this.errorEmail="Email is mandatory ";
    }else if( !this.userValidation.isValidEmail(this.studentData.userId.email) ){
       this.errorEmail="Enter Valid Email Address";
    }

    //password
    if( this.studentData.userId.password === ""){
      this.errorPassword="Password is mandatory";
    }  

    if(this.errorName=="" && this.errorNic=="" && this.errorTel=="" && this.errorAddress=="" && this.errorEmail=="" && this.errorPassword==""){
       this.studentService.studentUpdate(this.studentData).subscribe(
         response => {
          this.studentName=this.studentData.name;
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Update Succesfull',
            showConfirmButton: false,
            timer: 1000
          })
         },
         error => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Update Not Successful.',
            footer: 'Please Try Again Later.'
          })
         }
       )
    }
  }

  handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  };
}
