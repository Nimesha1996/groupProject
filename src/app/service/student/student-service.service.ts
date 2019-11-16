import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { StudentPackageAddComponent,StudentPackage } from '../../student/student-package-add/student-package-add.component';
import { StudentModel } from '../../ClassModel/StudentModel';
import { PackageModel } from '../../ClassModel/PackageModel';
import { CourseFee } from '../../ClassModel/CourseFeeModel';
import { PayPal } from '../../student/student-payment/student-payment.component';
import { ExamList } from '../../adminStaff/admin-staff-student-dash-board/admin-staff-student-dash-board.component';
import { API_URL, APP_ID_EXCHANGE_RATE } from '../../app.constants';
import { StudentPackageModel } from '../../ClassModel/StudentPackageModel';
import { ExchangeRate } from '../../ClassModel/MapObject/ExchangeRate';






@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {

  constructor(
    private http:HttpClient,
  ) { }

  //register the new student
  studentRegister(student:StudentModel){
    return this.http.post<any>(`${API_URL}/student/register`,student);
  }

  //get StudentList
  studentList(status){
      return this.http.get<StudentModel[]>(`${API_URL}/students/${status}`);
  }

  //getStudent following package's Id(Response is integer list)
  studentPackagesId(id:Number){
    return this.http.get<[]>(`${API_URL}/student/package/${id}`);
  }

  //getStudent following package's(Response is packageModel(list))
  studentPackages(id:Number){
    return this.http.get<PackageModel[]>(`${API_URL}/student/package/list/${id}`);
  }


  //insert student package details
  studentPackegeAdd(selectedPackage,id){
    return this.http.post<any>(`${API_URL}/student/package/${id}`,selectedPackage);
  }

  //delete student package details
  studentPackegeDelete(stuId,pacId){
    return this.http.delete<any>(`${API_URL}/student/package/${stuId}/${pacId}`);
  }

  //get student CourseFee Details
  studentCourseFees(stuId,pacId){
    return this.http.get<[]>(`${API_URL}/student/coursefees/${stuId}/${pacId}`);
  }

  // Add Course Fees
  studentCourseFeeAdd(courseFee:CourseFee,studentPackageId,packageId){
     return this.http.post<any>(`${API_URL}/student/coursefee/${studentPackageId}/${packageId}`,courseFee);
  }

  //Get Specific Student Details
  studentGet(studentId){
    return this.http.get<StudentModel>(`${API_URL}/student/${studentId}`);
  }

  //Update Student Data
  studentUpdate(student:StudentModel){
    return this.http.put<StudentModel>(`${API_URL}/student/update`,student);
  }

  //getStudent data using userId
  getStudentData(userId){
    return this.http.get<StudentModel>(`${API_URL}/student/user/${userId}`);
  }

  //delete Student Data
  studentDelete(stuId){
    return this.http.delete<any>(`${API_URL}/student/${stuId}`);
  }

  //get StudentId
  getStudentId(userId){
    return this.http.get<Number>(`${API_URL}/student/id/${userId}`);
  }

  //paypal
  makePayment(sum,userId) {
    return this.http.post<PayPal>(`${API_URL}/paypal/make/payment/?sum=`+sum+`&userId=`+userId,{});
  }

  completePayment(paymentId, payerId,userId,packageId,payment) {
    return this.http.post<any>(`${API_URL}/paypal/complete/payment/${paymentId}/${payerId}/${userId}/${packageId}/${payment}`, {});
  }

  exchngeRate(){
    return this.http.get<ExchangeRate>(`https://openexchangerates.org/api/latest.json?app_id=${APP_ID_EXCHANGE_RATE}&symbols=LKR`);
  }

  studentTrialList(date){
    return this.http.get<ExamList[]>(`${API_URL}/student/trial/list?date=`+date);
  }

  studentExamList(date){
    return this.http.get<ExamList[]>(`${API_URL}/student/exam/list?date=`+date);
  }

  //written Exam Data
  studentWrittenExamData(){
    return this.http.get<[]>(`${API_URL}/student/writtenexam/result`);
  }

  submitWrittenExamResult(date,countPass,countFail){
    return this.http.post<any>(`${API_URL}/student/writtenexam/result?date=`+date+"&countPass="+countPass+"&countFail="+countFail,{});
  }

  submitTrialExamResult(date,countPass,countFail){
    return this.http.post<any>(`${API_URL}/student/trialexam/result?date=`+date+"&countPass="+countPass+"&countFail="+countFail,{});
  }

  activateStudentAccount(studentId){
    return this.http.put<Number>(`${API_URL}/student/activate/account/${studentId}`,{});
  }

  clearStudentPreviousPayment(studentId){
    return this.http.delete<any>(`${API_URL}/student/clear/payment/${studentId}`,{});
  }
  
}
