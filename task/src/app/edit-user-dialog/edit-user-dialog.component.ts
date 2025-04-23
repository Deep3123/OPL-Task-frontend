import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserAuthServiceService } from '../services/user-auth-service.service'; // Ensure the correct import for the service

@Component({
  selector: 'app-edit-user-dialog',
  standalone: false,
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css'],
})
export class EditUserDialogComponent {
  editForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: UserAuthServiceService, // The service with the `updateUser` method
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // User data passed to the dialog
  ) {
    // Initialize the form with the data
    this.editForm = this.fb.group({
      name: [data.name, Validators.required],
      username: [{ value: data.username, disabled: true }], // Keep username disabled but included in submission
      email: [data.email, [Validators.required, Validators.email]],
      accessRole: [data.accessRole, Validators.required],
      gender: [data.gender, Validators.required], // Gender field
      contactNumber: [data.contactNumber, Validators.required],
      dob: [data.dob, Validators.required],
      address: [data.address, Validators.required],
      pinCode: [data.pinCode, Validators.required],
      password: [{ value: data.password, disabled: true }], // Keep password disabled but included in submission
    });
  }

  onUpdate(): void {
    if (this.editForm.invalid) return; // Temporarily enable the disabled controls to include their values in the form data

    this.editForm.controls['username'].enable();
    this.editForm.controls['password'].enable(); // Get the form values (now including username and password)

    const updatedUser = this.editForm.value; // Re-disable the controls after getting their values (for UI consistency)

    this.editForm.controls['username'].disable();
    this.editForm.controls['password'].disable(); // Call the service to update the user data

    this.service.updateUser(updatedUser).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: `${this.editForm.value.name}'s details have been updated.`,
        });
        this.dialogRef.close(true); // Close the dialog and pass true to indicate success
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: err.error.message, // Display the error message returned by the backend
        });
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}
