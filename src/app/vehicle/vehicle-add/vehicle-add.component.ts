import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceService} from '../../service/user/user-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VehicleServiceService } from '../../service/vehicle/vehicle-service.service';
import { UserModel } from '../../ClassModel/UserModel';
import { VehicleModel } from '../../ClassModel/VehicleModel';
import { HttpError } from '../../Shared/httpError/HttpError';
import { UserValidation } from '../../Shared/validation/user-validation/user-validation';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.scss']
})
export class VehicleAddComponent implements OnInit {

  //form variables
  name:String="";
  nic:String="";
  tel:String="";
  address:String="";
  email:String="";
  password:String="";
  examDate:Date=null;
  trialDate:Date;

  //form error messages variables
  errorName;
  errorNic;
  errorTel;
  errorAddress;
  errorEmail;
  errorPassword;
  errorExamDate;
  errorTrialExamDate;
  errorMessageDate;  

  errorMessage:String;
  regexp:any;//Regular Expression for NIC
  test:boolean;//Regular exprssion result

  //idate:Date;
  
  //user Validation Instance
  userValidation = new UserValidation();

  constructor(
   private router:Router,
   private userService:UserServiceService,
   private vehicleService:VehicleServiceService
  ) { }

  ngOnInit() {
    
  }

  //Vehicle Registration Funtion
  registerVehicle(){
    
    this.errorName="";
    this.errorNic="";
    this.errorTel="";
    this.errorEmail="";
    this.errorPassword="";
    this.errorExamDate="";
    this.errorAddress="";

    //validate name
    if(this.name===""){
      this.errorName="Name is mandatory";
    }

    //validate NIC
    if(this.nic===""){
      this.errorNic="NIC number is mandatory ";
    }else if( !this.userValidation.isValidNicNumber(this.nic) ){
      this.errorNic="Enter Valid NIC Number";
    }

    //Valid Number
    if(this.tel===""){
      this.errorTel="Telephone number is mandatory";
    }else if( !this.userValidation.isValidTelNumber(this.tel) ){
      this.errorTel="Enter Valid Telephone Number ";
    }

    //valid address
    if( this.address === "" ){
      this.errorAddress="Address is mandatory ";
    }

    //valid email
    if( this.email === "" ){
      this.errorEmail="Email is mandatory ";
    }else if( !this.userValidation.isValidEmail(this.email) ){
       this.errorEmail="Enter Valid Email Address";
    }

    //password
    if( this.password === ""){
      this.errorPassword="Password is mandatory";
    }  

    //valid Exam Date
    if( this.examDate != null && this.trialDate==null){
      if(!this.userValidation.isFutureDate(new Date(this.examDate))){
        this.errorExamDate="Wriiten Exam date should be future date.";
      }
    }

    //Valid Trial Date
    if(this.trialDate != null && this.examDate==null){
      if(!this.userValidation.isFutureDate(new Date(this.trialDate))){
        this.errorTrialExamDate="Trial Exam date should be future date.";
      }
    } 

    //valid Trial Date & Exam Date
   if(this.trialDate!=null && this.examDate!=null){
     this.errorMessageDate="Canno't insert both date";
   }


    //Save to the DB
    if(this.errorName=="" && this.errorNic=="" && this.errorTel=="" && this.errorAddress=="" && this.errorEmail=="" && this.errorPassword=="" && this.errorExamDate==""){
      console.log("ok");
      //work with backend service

      //1)Save User relevant Data
      this.userService.userRegister(new UserModel(-1,this.email,this.password,new Date(),1,5)).subscribe(
        response => {
          var userId=response.userId

          //Save vehicle relevant Data
          this.vehicleService.vehicleRegister(new VehicleModel(-1,this.name,this.tel,this.nic,this.examDate,this.trialDate,this.address,response)).subscribe(
            response => {
             
              if(response == 1){
                
                //register success
                Swal.fire({
                  position: 'top-end',
                  type: 'success',
                  title: 'Registration Successful.',
                  showConfirmButton: false,
                  timer: 2000
                });
                this.router.navigate(['vehicle-list'])

              }else{
                
                //vehicle already registered
                //If it's error should delete user record from the db

                Swal.fire({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Vehicle Registration Not Successful!.',
                  footer: 'Vehicle Already Registered.'
                })

                this.userService.userDelete(userId).subscribe(
                response => {console.log("user delete success")},
                error => {console.log("User delete not success")}
                );

              }
              },
            error => {

              Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Vehicle Registration Not Successful!.',
                footer: 'Please Try Again Later'
              })

              console.log(error);
              this.handleErrorResponse(error);
            }
          )

        },
        error => {
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Vehicle Registration Not Successful!.',
            footer: 'Please Try Again Later'
          });
          console.log(error);
          this.handleErrorResponse(error)
        }
      )
      
    }

  }


  closeError(){
    this.errorMessage="";
  }

  handleErrorResponse(error: HttpErrorResponse) {
    this.errorMessage="There is a problem with the service. please try again later.";
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  };

}
