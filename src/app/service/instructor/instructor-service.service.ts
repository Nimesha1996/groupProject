import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../app.constants';
import { TimeTableDataList } from '../../ClassModel/MapObject/TimeTableDataList';
import { LessonAssingStudentMap } from '../../ClassModel/MapObject/LessonAssignStudentMap';
import { StudentPractricalChartDataMap } from '../../ClassModel/MapObject/StudentPractricalChartDataMap';

@Injectable({
  providedIn: 'root'
})
export class InstructorServiceService {

  constructor(
    private http:HttpClient
  ) { }

  getInstructorLesson(userId){
    return this.http.get<TimeTableDataList[]>(`${API_URL}/instructor/lesson/${userId}`);
  }

  getAssignStudent(userId,lessonId){
    return this.http.get<LessonAssingStudentMap[]>(`${API_URL}/instructor/assignstudent/${userId}/${lessonId}`);
  }

  getLessonDate(userId,lessonId){
    return this.http.get<Date>(`${API_URL}/instructor/lesson/date/${userId}/${lessonId}`);
  }

  markStudentLesson(studentLessonId,mark){
    return this.http.post<any>(`${API_URL}/instructor/student/lesson/mark/${studentLessonId}/${mark}`,{});
  }

  getPractricalLessonChartStudentData(studentLessonId){
    return this.http.get<StudentPractricalChartDataMap>(`${API_URL}/instructor/student/practrical/lesson/${studentLessonId}`);
  }
}
