import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from '../../service/student/student-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { StudentModel } from '../../ClassModel/StudentModel';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { UserValidation } from '../../Shared/validation/user-validation/user-validation';

@Component({
  selector: 'app-student-deactivate',
  templateUrl: './student-deactivate.component.html',
  styleUrls: ['./student-deactivate.component.scss']
})
export class StudentDeactivateComponent implements OnInit {

  deactivateStudents:StudentModel[];

  validation:UserValidation = new UserValidation();

  constructor(
    private studentService:StudentServiceService,
    private router:Router
  ) { }

   //Filter Option Implement
   filteredDeactivateStudent: StudentModel[] = [];
   private _searchTerm:string;
   get searchTerm(): string{
     return this._searchTerm;
   }
   set searchTerm(value:string){
     this._searchTerm=value;
     this.filteredDeactivateStudent = this.filterStudent(value);
   }
 
   filterStudent(searchString:string){
      if(this.validation.isDigitContain(searchString)){
       return this.deactivateStudents.filter(student => 
         student.nic.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) ;
      }
      return this.deactivateStudents.filter(student => 
         student.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) ;
   }
   //Finish filter option implementation

  ngOnInit() {
    this.deactivatestudentList();
  }
  
  deactivatestudentList(){
    this.studentService.studentList(0).subscribe(
      response => {
        this.deactivateStudents=response;
        this.filteredDeactivateStudent=this.deactivateStudents;
      },
      error => {
        this.handleErrorResponse(error);
      }
    );
  }

  acivateStudentAccount(studentId,studentName){
     this.studentService.activateStudentAccount(studentId).subscribe(
       response => {
        if(response==1){//Previous payment are completed
          console.log(response)
          Swal.fire({
            position: 'center',
            type: 'success',
            title: studentName+'\'s account activated.',
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['student-list']);
        }else{//previous payment are not completed
          Swal.fire({
            title: 'Is Account Activate?',
            html: "<strong>Previous course payments are not completed.</strong>",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Activate'
          }).then((result) => {
            if (result.value) {
              this.clearStudentPreviousPayment(studentId,studentName);
            }
          });
        }
       },
       error => {
         console.log(error);
         this.handleErrorResponse(error);
       }
     );
  }

    //navigate to student-payment 
    addPayment(studentId){
      this.router.navigate(['student-payment',studentId]);
    }

    //clear student's previous payment details
    clearStudentPreviousPayment(studentId,studentName){
      this.studentService.clearStudentPreviousPayment(studentId).subscribe(
        response => {
          console.log(response);
          Swal.fire({
            position: 'center',
            type: 'success',
            title: studentName+'\'s account activated.',
            showConfirmButton: false,
            timer: 2000
          });
          this.router.navigate(['student-list']);
        },
        error => {
          console.log(error);
          Swal.fire({
            position: 'center',
            type: 'success',
            title: studentName+'\'s account not activated.',
            showConfirmButton: false,
            timer: 2000
          });
        }
      )
    }

  private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  }
}
