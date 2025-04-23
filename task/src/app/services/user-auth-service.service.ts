import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { ForgotPasswordRequest } from '../dtoClasses/forgot-password-request';

@Injectable({
  providedIn: 'root',
})
export class UserAuthServiceService {
  private baseUrl: string = 'http://localhost:8080'; // Make sure this is the correct API base URL

  constructor(private http: HttpClient) {}

  // Send the registration data to the backend API (no Authorization needed)
  saveUserData(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // Send login data to backend API (no Authorization needed)
  userLogin(params: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, params, {
      withCredentials: true,
    });
  }

  // Forgot password (no Authorization needed)
  // forgotPassword(params: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/forgot-password`, params);
  // }

  // Update the forgotPassword method in your UserAuthServiceService
  // Update the forgotPassword method in your UserAuthServiceService
  forgotPassword(
    forgotPasswordRequest: ForgotPasswordRequest
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/forgot-password`,
      forgotPasswordRequest,
      {
        withCredentials: true,
      }
    );
  }

  // Reset password (no Authorization needed)
  resetPassword(
    resetPassword: any,
    username: any,
    timestamp: any,
    token: any
  ): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/reset-password/${username}/${timestamp}/${token}`,
      resetPassword
    );
  }

  // Get all users (Authorization required)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-all-user-details`);
  }

  // Delete user (Authorization required)
  deleteUser(username: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/delete-user-by-username/${username}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update-user-by-username`, user);
  }
}
