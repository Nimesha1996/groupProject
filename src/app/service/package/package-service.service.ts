import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PackageModel } from '../../ClassModel/PackageModel';
import { API_URL } from '../../app.constants';



@Injectable({
  providedIn: 'root'
})
export class PackageServiceService {

  constructor(
    private http:HttpClient
  ) { }

  public packageList(){
    return this.http.get<PackageModel[]>(`${API_URL}/packages`);
  }

  getOrderpackageList(lessonId){
    return this.http.get<PackageModel[]>(`${API_URL}/package/${lessonId}`);
  }

  getNumStudentPackage(packageId,transmissionType){
    return this.http.get<Number>(`${API_URL}/package/student/${packageId}/${transmissionType}`);
  }
}
