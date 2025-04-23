import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CaptchaServiceService {
  private captchaUrl: string = 'http://localhost:8080/captcha';

  private sessionToken: string | null = null;

  constructor(private http: HttpClient) {
    // Check if running in the browser before accessing sessionStorage
    if (typeof window !== 'undefined') {
      this.sessionToken = sessionStorage.getItem('X-Auth-Token');
    }
  }

  // Method to fetch a CAPTCHA image (will return a blob)
  getCaptchaImage(): Observable<Blob> {
    return this.http.get(this.captchaUrl, {
      responseType: 'blob',
      withCredentials: true,
    });
  }
}
