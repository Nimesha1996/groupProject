import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../ClassModel/UserModel';
import { API_URL } from '../app.constants';



@Injectable({
  providedIn: 'root'
})
export class UserAuthenticationServiceService {


  constructor(
    private http:HttpClient,
  ) { }

  authenticate(email){
    return this.http.get<UserModel>(`${API_URL}/login/${email}`);
  }
}
