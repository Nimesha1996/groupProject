import { Component, OnInit } from '@angular/core';
import { StudentModel } from '../../ClassModel/StudentModel';
import { ActivatedRoute } from '@angular/router';
import { StudentServiceService } from '../../service/student/student-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../ClassModel/UserModel';
import { UserValidation } from '../../Shared/validation/user-validation/user-validation';
import Swal from 'sweetalert2';
import { HttpError } from '../../Shared/httpError/HttpError';
import { EncryptDecryptServiceService } from '../../service/encrypt-decrypt-service.service';



@Component({
  selector: 'app-student-more-details',
  templateUrl: './student-more-details.component.html',
  styleUrls: ['./student-more-details.component.scss']
})
export class StudentMoreDetailsComponent implements OnInit {
  
  studentId;
  isUpdateVariable=false;
  selectOption;//updated variable Name(number)
  updateVariable;
  placeHolder;
  updateName;//update variable Name
  confirmUpdate=false;


  errorMessage;
  errorUpdateMessage="";
  
  userValidation=new UserValidation();

  studentData:StudentModel=new StudentModel(1,'Nuwan','0773015590','980150429v',new Date(),new Date(),'No 20 Homagama',new UserModel(1,'nuwan@gmail.com','1234',new Date(),1,1));

  constructor(
    private route:ActivatedRoute,
    private studentService:StudentServiceService,
    private encoder : EncryptDecryptServiceService
  ) { }

  ngOnInit() {
    this.studentId=this.route.snapshot.params['id'];//get student id by url
    this.studentDetails();
  }

  isUpdate(option){
    this.errorUpdateMessage="";
    
    if( (option === 1)){  this.isUpdateVariable=true;  this.selectOption=option;  this.placeHolder="New Email";  this.updateName="Email"; this.updateVariable=this.studentData.userId.email;}
    if( (option === 2)){  this.isUpdateVariable=true;  this.selectOption=option;  this.placeHolder="New Password";  this.updateName="Password"; this.updateVariable=this.studentData.userId.password;}
    if( (option === 3)){  this.isUpdateVariable=true;  this.selectOption=option;  this.placeHolder="Exam Date(2015-01-10)"; this.updateName="Exam Date"; this.updateVariable=this.studentData.examDate;}
    if( (option === 4)){ this.isUpdateVariable=true;  this.selectOption=option;  this.placeHolder="Trial Date(2015-01-10)"; this.updateName="Trial Date"; this.updateVariable=this.studentData.trialDate;}
  }

  update(){
    
    //email 
    if(this.selectOption==1) {
      if( (this.updateVariable == "") || !this.userValidation.isValidEmail(this.updateVariable)){
          this.errorUpdateMessage="Insert Valid Email Address.";
      }else{
          this.studentData.userId.email=this.updateVariable;
          this.errorUpdateMessage="";
          this.isUpdateVariable=false;
          this.confirmUpdate=true;
      }
    }

    //password
    if(this.selectOption==2) {
      if( (this.updateVariable == "")){
          this.errorUpdateMessage="Insert Valid Password.";
      }else{
          this.studentData.userId.password=this.updateVariable;
          this.errorUpdateMessage="";
          this.isUpdateVariable=false;
          this.confirmUpdate=true;
      }
    }

    //Exam Date
    if(this.selectOption==3 && this.studentData.trialDate==null){
      if( (this.updateVariable == null || !this.userValidation.isValidDate(this.updateVariable)) ){
        this.errorUpdateMessage="Insert Valid Exam Date.";
      }else if( !(this.userValidation.isFutureDate(this.updateVariable))){
        this.errorUpdateMessage="Exam Date must be future Date";
      }else{
        this.studentData.examDate=this.updateVariable;
        this.errorUpdateMessage="";
        this.isUpdateVariable=false;
        this.confirmUpdate=true;
      }
    }

    //Trial Date
    if(this.selectOption==4 && this.studentData.examDate==null){
      console.log("Hello")
      if( (this.updateVariable == null || !this.userValidation.isValidDate(this.updateVariable))){
        this.errorUpdateMessage="Insert Valid Trial Date.";
      }else if(!(this.userValidation.isFutureDate(this.updateVariable))){
        this.errorUpdateMessage="Trial Date must be future Date";
      }else{
        this.studentData.trialDate=this.updateVariable;
        this.errorUpdateMessage="";
        this.isUpdateVariable=false;
        this.confirmUpdate=true;
      }
    }

    //check both data
    if(this.selectOption==3 || this.selectOption==4){
      if( (this.selectOption==3 && this.studentData.trialDate!=null) || (this.selectOption==4 && this.studentData.examDate!=null) ){
        let examDate = (this.selectOption==3 ? this.updateVariable : this.studentData.examDate);
        let trialDate = (this.selectOption==4 ? this.updateVariable : this.studentData.trialDate);
        
        if(this.selectOption==3){
          if(this.updateVariable!=null && this.userValidation.isValidDate(this.updateVariable)){
            if(this.userValidation.isFutureDate(this.updateVariable)){
              if(this.userValidation.isValidExamDateTrialDate(examDate,trialDate)){
                this.studentData.examDate=this.updateVariable;
                this.errorUpdateMessage="";
                this.isUpdateVariable=false;
                this.confirmUpdate=true;
              }else{
                this.errorUpdateMessage="Exam Date must not be beyond the trial date";
              }
            }else{
              this.errorUpdateMessage="Exam Date must be future Date";
            }
          }else{
            this.errorUpdateMessage="Insert Valid Exam Date"
          }
         
        }



        if(this.selectOption==4){
          if(this.updateVariable!=null && this.userValidation.isValidDate(this.updateVariable)){
            if(this.userValidation.isFutureDate(this.updateVariable)){
              if(this.userValidation.isValidExamDateTrialDate(examDate,trialDate)){
                this.studentData.trialDate=this.updateVariable;
                this.errorUpdateMessage="";
                this.isUpdateVariable=false;
                this.confirmUpdate=true;
              }else{
                this.errorUpdateMessage ="Trial Date must be over the exam date";
              }
            }else{
              this.errorUpdateMessage="Trial Date must be future Date";
            }
          }else{
            this.errorUpdateMessage="Insert Valid Trial Date"
          }
         
        }

        
      }
    }
   
  }


  close(){
    this.isUpdateVariable=false;
  }

  //get Student Details from the API
  studentDetails(){
    
    this.studentService.studentGet(this.studentId).subscribe(
      response => {
          this.studentData=response;
          this.studentData.userId.password=this.encoder.decrypt(this.studentData.userId.password);
      },
      error =>{
        console.log(error);
        this.handleErrorResponse(error);
      }
    )
  }

  //save updates
  saveUpdate(){
    //Save Update data(API)
    this.studentData.userId.password=this.encoder.encrypt(this.studentData.userId.password);
    this.studentService.studentUpdate(this.studentData).subscribe(
      response => {
          //register success
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'Update Successful.',
            showConfirmButton: false,
            timer: 1500
          });
        this.confirmUpdate=false;
        this.studentData=response;
        this.studentData.userId.password=this.encoder.decrypt(this.studentData.userId.password);
      },
      error => {
        //console.log(error);
        this.handleErrorResponse(error);
        Swal.fire({
          position: 'center',
          type: 'error',
          title: 'Update not Successful!',
          showConfirmButton: false,
          timer: 2000
        });
      }
       
    )
  }


  //error handling
  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError=new HttpError();
    httpError.ErrorResponse(error);
  };

  closeError(){
    this.errorMessage=null;
  }
}
