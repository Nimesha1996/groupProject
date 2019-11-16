import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { UserModel } from '../../ClassModel/UserModel';
import { API_URL } from '../../app.constants';
import { EncryptDecryptServiceService } from '../encrypt-decrypt-service.service';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(
    private http:HttpClient,
    private encoder : EncryptDecryptServiceService
  ) { }
  

  userRegister(user:UserModel){
    let password = user.password;
    user.password=this.encoder.encrypt(password);
      return this.http.post<UserModel>(`${API_URL}/user/register`,user);
  }

  userDelete(userId:Number){
    return this.http.delete<any>(`${API_URL}/user/${userId}`);
  }
  
}
