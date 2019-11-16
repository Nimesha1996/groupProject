import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentPackageModel } from '../../ClassModel/StudentPackageModel';
import { API_URL } from '../../app.constants';
import { LessonModel } from '../../ClassModel/LessonModel';
import { PackageModel } from '../../ClassModel/PackageModel';
import { StudentLessonModel } from '../../ClassModel/StudentLessonModel';
import { LessonDayFeedbackChartDataMap } from '../../ClassModel/MapObject/LessonDayFeedbackChartDataMap';

@Injectable({
  providedIn: 'root'
})
export class LessonBookingService {

  constructor(
    private http  : HttpClient
  ) { }

  getStudentPackageData(userId){
    return this.http.get<StudentPackageModel[]>(`${API_URL}/lessonbooking/studentpackage/${userId}`);
  }

  getTrialDate(userId){
    return this.http.get<Date>(`${API_URL}/lessonbooking/trialdate/${userId}`);
  }

  getAvailableLesson(date,studentPackageId,timeSlotId){
    return this.http.get<LessonModel>(`${API_URL}/lessonbooking/${date}/${studentPackageId}/${timeSlotId}`);
  }

  saveBooking(lessonId,studentPackegeId,date){
    console.log(date);
    return this.http.post<Number>(`${API_URL}/lessonbooking/${lessonId}/${studentPackegeId}/${date}`,{});
  }

  //get Student following package details
  getStudentPackages(userId){
    return this.http.get<PackageModel[]>(`${API_URL}/lessonbooking/studentpackages/${userId}`);
  }

  //get Student's Booking lesson details
  getBookLessonDetails(userId,packageId){
    return this.http.get<StudentLessonModel[]>(`${API_URL}/lessonbooking/booklessons/${userId}/${packageId}`);
  }

  cancelBooking(studentLessonId){
    console.log(studentLessonId)
    return this.http.delete(`${API_URL}/lessonbooking/cancelbooking/${studentLessonId}`);
  }

  lessonDayFeedback(userId,packageId,day1,time1,day2,time2){
    return this.http.post<any>(`${API_URL}/lessonbooking/lessonday/feedback/${userId}/${packageId}/${day1}/${time1}/${day2}/${time2}`,{});
  }

  lessonFeedbackChartData(packageId,transmission,time){
    return this.http.get<LessonDayFeedbackChartDataMap[]>(`${API_URL}/lessonbooking/lessonday/feedback/chart/${packageId}/${transmission}/${time}`);
  }
}
