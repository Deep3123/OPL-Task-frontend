import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserAuthServiceService } from '../services/user-auth-service.service'; // Ensure correct import
import Swal from 'sweetalert2'; // SweetAlert for stylish pop-up
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private userAuthService: UserAuthServiceService
  ) {}

  // user = new User();

  isLoading: boolean = false;
  profileImage: File | null = null;

  // Method to handle file selection
  onFileChange(event: any): void {
    this.profileImage = event.target.files[0];
  }

  onRegisterSubmit(form: NgForm) {
    if (form.valid) {
      const formData = new FormData();
      formData.append('name', form.value.name);
      formData.append('email', form.value.email);
      formData.append('dob', form.value.dob);
      formData.append('username', form.value.username);
      formData.append('password', form.value.password);
      formData.append('gender', form.value.gender);
      formData.append('address', form.value.address);
      formData.append('mobileNo', form.value.mobileNo);
      formData.append('pinCode', form.value.pinCode);
      formData.append('accessRole', form.value.accessRole);

      if (this.profileImage) {
        formData.append('profileImage', this.profileImage);
      }

      // const userData = {
      //   name: form.value.name,
      //   email: form.value.email,
      //   dob: form.value.dob,
      //   username: form.value.username,
      //   password: form.value.password,
      //   gender: form.value.gender,
      //   address: form.value.address,
      //   mobileNo: form.value.mobileNo,
      //   pinCode: form.value.pinCode,
      //   accessRole: form.value.accessRole,
      // };

      this.userAuthService.saveUserData(formData).subscribe(
        (data: any) => {
          Swal.fire({
            title: 'Registration Successful',
            icon: 'success',
            text: 'Welcome to JetWayz!',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/login']);
            }
          });
        },
        (error) => {
          console.error(error);
          Swal.fire({
            title: 'Error',
            text: 'Registration failed. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      );
    }
  }
}
