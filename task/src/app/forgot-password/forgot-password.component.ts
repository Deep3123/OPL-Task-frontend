import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { CaptchaServiceService } from '../services/captcha-service.service';
import { ForgotPasswordRequest } from '../dtoClasses/forgot-password-request';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  isLoading: boolean = false;
  captchaUrl: string = ''; // Will hold the CAPTCHA image URL

  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    private captchaService: CaptchaServiceService
  ) {}

  ngOnInit() {
    this.loadCaptcha();
  }

  loadCaptcha() {
    this.captchaService.getCaptchaImage().subscribe(
      (response: Blob) => {
        // Create a URL for the blob image
        this.captchaUrl = URL.createObjectURL(response);
      },
      (error) => {
        const errorMessage =
          error.message ||
          error.error?.message ||
          'Error fetching CAPTCHA image.';

        Swal.fire({
          icon: 'error',
          title: 'Captcha not loading!',
          text: errorMessage,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  // Method to reload CAPTCHA image
  reloadCaptcha() {
    this.loadCaptcha();
  }

  onSubmit(forgotPasswordForm: NgForm) {
    if (forgotPasswordForm.valid) {
      const forgotPasswordRequest = new ForgotPasswordRequest();
      forgotPasswordRequest.email = forgotPasswordForm.value.email;
      forgotPasswordRequest.captchaResponse =
        forgotPasswordForm.value.captchaInput;

      this.isLoading = true;
      console.log('Loading started...');

      this.userAuthService.forgotPassword(forgotPasswordRequest).subscribe(
        (response) => {
          this.isLoading = false;
          console.log('Loading finished');

          Swal.fire({
            icon: 'success',
            title: 'Email Sent Successfully!',
            text: response.message,
            confirmButtonText: 'OK',
          }).then(() => {
            forgotPasswordForm.reset();
            this.reloadCaptcha(); // Reset captcha after successful submission
          });
        },
        (error) => {
          this.isLoading = false;
          console.error('Error occurred:', error);

          const errorMsg =
            error?.error?.message || error?.message || 'Something went wrong!';

          Swal.fire({
            icon: 'error',
            title: 'Email has not been sent!',
            text: errorMsg,
            confirmButtonText: 'OK',
          });

          this.reloadCaptcha(); // Reload captcha on error
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Form Invalid',
        text: 'Please fill in all fields correctly.',
        confirmButtonText: 'OK',
      });
    }
  }
}
