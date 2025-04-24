import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CaptchaServiceService } from '../services/captcha-service.service';
import { LoginReq } from '../dtoClasses/login-req';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { UserAuthServiceService } from '../services/user-auth-service.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService,
    private authService: AuthService,
    private captchaService: CaptchaServiceService
  ) {}

  login = new LoginReq();

  captchaInput: string = '';
  captchaUrl: string = '';
  isLoading: boolean = false;
  showPassword: boolean = true;

  ngOnInit() {
    this.loadCaptcha();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loadCaptcha() {
    this.captchaService.getCaptchaImage().subscribe(
      (response: Blob) => {
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

  reloadCaptcha() {
    this.loadCaptcha();
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.login.username = form.value.username;
      this.login.password = form.value.password;
      this.login.captchaResponse = form.value.captchaInput;

      this.isLoading = true;

      this.userAuthService.userLogin(this.login).subscribe(
        (response) => {
          this.isLoading = false;

          // ✅ Save token and user data
          this.authService.login(response.token, response.role);
          localStorage.setItem('user', JSON.stringify(response)); // Save user data

          Swal.fire({
            icon: 'success',
            title: 'Login Successful!',
            text: 'You have successfully logged in.',
            confirmButtonText: 'OK',
          }).then(() => {
            form.reset();
            this.router.navigate(['/admin']);
          });
        },
        (error) => {
          this.isLoading = false;

          const errorMessage =
            error.error?.message ||
            error.error?.error?.message ||
            'Login failed. Please try again.';

          Swal.fire({
            icon: 'error',
            title: 'Login Failed!',
            text: errorMessage,
            confirmButtonText: 'OK',
          });

          this.reloadCaptcha();
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
