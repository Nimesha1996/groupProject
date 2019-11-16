import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentServiceService } from '../../service/student/student-service.service';
import { StudentModel } from '../../ClassModel/StudentModel';
import Swal from 'sweetalert2';
import { HttpError } from '../../Shared/httpError/HttpError';
import { UserValidation } from '../../Shared/validation/user-validation/user-validation';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {

  errorMessage="";

  students: StudentModel[] = [];
 

  validation:UserValidation = new UserValidation();

  //Filter Option Implement
  filteredStudent: StudentModel[] = [];
  private _searchTerm:string;
  get searchTerm(): string{
    return this._searchTerm;
  }
  set searchTerm(value:string){
    this._searchTerm=value;
    this.filteredStudent = this.filterStudent(value);
  }

  filterStudent(searchString:string){
     if(this.validation.isDigitContain(searchString)){
      return this.students.filter(student => 
        student.nic.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) ;
     }
     return this.students.filter(student => 
        student.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1) ;
  }
  //Finish filter option implementation

  constructor(
    private router:Router,
    private studentService:StudentServiceService
  ) { }

  ngOnInit() {
    this.studentList();
  }

  //get Student List
  studentList(){
    this.studentService.studentList(1).subscribe(
      response => {
        this.students=response;
        this.filteredStudent=this.students;
      },
      error => {
        this.handleErrorResponse(1,error);
      }
    );
  }

  //navigate to studentRegister Page
  addStudent(){
    this.router.navigate(['student-add'])
  }

  //delete Student
  deleteStudent(studentId,studentName){
    Swal.fire({
      title: 'Are you sure?',
      text: "Is delete "+studentName +"'s record?",//" student's details,payemnt details and all other relevant information.Can't revert the data!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        
        //Call to API
        this.studentService.studentDelete(studentId).subscribe(
          response => {
            this.studentList();
            Swal.fire({
              position: 'center',
              type: 'success',
              title: studentName+'\'s record was deleted successful',
              showConfirmButton: false,
              timer: 3000
            });
          },
          error => {
            this.handleErrorResponse(0,error);
            Swal.fire({
              position: 'center',
              type: 'error',
              title: studentName+'\'s record was deleted not successful',
              showConfirmButton: false,
              timer: 3000
            });
          }
           
        );
      }
    })
  }


  //navigate to student-package
  addPackage(studentId:Number){
    console.log(studentId);
    this.router.navigate(['student-package-add',studentId])
  }

  //navigate to student-payment 
  addPayment(studentId){
    this.router.navigate(['student-payment',studentId])
  }

  //navigate to more details page
  moreDetails(studentId){
    this.router.navigate(['student-more-details',studentId]);
  }

  closeError(){
    this.errorMessage="";
  }

  studentPaymentCheck(){
    this.router.navigate(['student-payment-check']);
  }

  studentDeactivate(){
    this.router.navigate(['student-deactivate']);
  }

  /*
  1 -->  Initialize API Call
  0 --> Other API Call
  */
  handleErrorResponse(type,error){
    if(type==1){
      this.errorMessage="There is a problem with the service. please try again later.";
    }
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  }

}
