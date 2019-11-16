import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimeSlotModel } from '../../ClassModel/TimeSlotModel';
import { API_URL } from '../../app.constants';
import { PackageModel } from '../../ClassModel/PackageModel';
import { Path } from '../../ClassModel/PathModel';
import { InstructorMap } from '../../ClassModel/MapObject/InstructorMap';
import { TimeTableDataList } from '../../ClassModel/MapObject/TimeTableDataList';
import { LessonModel } from '../../ClassModel/LessonModel';
import { LessonDistributionMap } from '../../ClassModel/MapObject/LessonDistributionMap';
import { PackageAnalysisData } from '../../ClassModel/MapObject/PackageAnalysisData';
import { StudentAttendanceWeeksMap } from '../../ClassModel/MapObject/StudentAttendanceWeeksMap';


@Injectable({
  providedIn: 'root'
})
export class TimeTableServiceService {

  constructor(
    private http:HttpClient
  ) { }

  //Time Slots URL
  getTimeSlotList(){
    return this.http.get<TimeSlotModel[]>(`${API_URL}/timetable/timeslots`);
  }

  getOrderTimeSlotList(lessonId){
    return this.http.get<TimeSlotModel[]>(`${API_URL}/timetable/timeslot/${lessonId}`)
  }

  updateTimeSlot(timeSlot:TimeSlotModel){
    return this.http.put<any>(`${API_URL}/timetable/timeslot`,timeSlot);  
  }

  addTimeSlot(timeSlot:TimeSlotModel){
    return this.http.post<any>(`${API_URL}/timetable/timeslot`,timeSlot);  
  }

  deleteTimeSlot(timeSlotId){
    return this.http.delete(`${API_URL}/timetable/timeslot/${timeSlotId}`);
  }


  //Path URL
  addPath(path:Path){
    return this.http.post<any>(`${API_URL}/timetable/path`,path);
  }

  deletePath(pathId){
    console.log(pathId);
    return this.http.delete<any>(`${API_URL}/timetable/path/${pathId}`)
  }

  getPathList(){
    return this.http.get<Path[]>(`${API_URL}/timetable/path`);
  }

  getOrderPathList(lessonId){
    return this.http.get<Path[]>(`${API_URL}/timetable/path/${lessonId}`);
  }

  updatePath(path:Path){
    console.log(path)
    return this.http.put<any>(`${API_URL}/timetable/path`,path);
  }

  //subPath
  addSubPath(pathId,subPaths){
    return this.http.post<Number>(`${API_URL}/timetable/subpath/${pathId}`,subPaths);
  }

  getSubPathList(pathId){
    return this.http.get<String[]>(`${API_URL}/timetable/subpath/${pathId}`);
  }

  updateSubPath(pathId,subPaths){
    console.log(pathId)
    console.log(subPaths)
    return this.http.put<Number>(`${API_URL}/timetable/subpath/${pathId}`,subPaths);
  }


  getRelevantInstructorsList(day:Number ,selectPackageId:Number, selectTimeSlotId:Number, selectPathId:Number, transmission:Number){
      return this.http.get<InstructorMap[]>(`${API_URL}/timetable/instructors/${day}/${selectPackageId}/${selectTimeSlotId}/${selectPathId}/${transmission}`);
  }

  //lesson url
  addLesson(day,timeSlotId,pathId,packageId,instructorId,numStudent,transmission){
      return this.http.post<any>(`${API_URL}/timetable/lesson/${day}/${packageId}/${timeSlotId}/${pathId}/${transmission}/${instructorId}/${numStudent}`,{});
  }

  getTimeTableList(type){//type 0:Deactivate Lessons / 1:Activate Lessons
    return this.http.get<TimeTableDataList[]>(`${API_URL}/timetable/lessons/${type}`);
  }

  getLesson(lessonId){
    return this.http.get<LessonModel>(`${API_URL}/timetable/lesson/${lessonId}`);
  }

  deleteLesson(lessonId){
    return this.http.delete<Number>(`${API_URL}/timetable/lesson/${lessonId}`);
  }

  lessonDeactivate(lessonId){
    return this.http.put<any>(`${API_URL}/timetable/lesson/deactivate/${lessonId}`,{});
  }

  lessonActivate(lessonId){
    return this.http.put<any>(`${API_URL}/timetable/lesson/activate/${lessonId}`,{});
  }

  updateLesson(lessonId,type,dayId,timeSlotId,pathId,instructorId,numStudent){
    return this.http.put<any>(`${API_URL}/timetable/lesson/${lessonId}/${type}/${dayId}/${timeSlotId}/${pathId}/${instructorId}/${numStudent}`,{})
  }

  getLessonDistributionDetails(packageId,transmission){
    return this.http.get<LessonDistributionMap[]>(`${API_URL}/timetable/lesson/week/${packageId}/${transmission}`);
  }

  //get lesson for relevant package
  getLessonsByPackageId(packageId,transmission){
    return this.http.get<PackageAnalysisData[]>(`${API_URL}/timetable/lesson/details/${packageId}/${transmission}`);
  }

  getLessonTimeSlotByPackageId(packageId,transmission){
    return this.http.get<TimeSlotModel[]>(`${API_URL}/timetable/lesson/timeslot/${packageId}/${transmission}`);
  }

  //Give result as true , if selected package has any lesson.
  isAnyLesson(packageId,transmission){
    return this.http.get<Boolean>(`${API_URL}/timetable/lesson/isanylesson/${packageId}/${transmission}`);
  }

  //getStudent Attendance details week by weel
  getStudentAttendance(lessonId,time){
    return this.http.get<StudentAttendanceWeeksMap[]>(`${API_URL}/timetable/lesson/student/attendance/${lessonId}/${time}`);
  }

  //get Lesson Publish Date
  getLessonPublishDate(lessonId){
    return this.http.get<Date>(`${API_URL}/timetable/lesson/date/${lessonId}`);
  }

}
