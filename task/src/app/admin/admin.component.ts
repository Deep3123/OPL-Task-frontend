// admin.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  mobileMenuOpen = false;
  userMenuOpen = false;

  constructor(private router: Router) {}

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  getUserInitials(): string {
    // Replace with actual user name from your auth service
    const name = 'Admin User';
    if (!name) return '?';

    const nameParts = name.trim().split(' ');
    const initials = nameParts
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('');

    return initials;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);

    // Swal.fire({
    //   title: 'Logout',
    //   text: 'Are you sure you want to log out?',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, Logout',
    //   cancelButtonText: 'Cancel',
    //   confirmButtonColor: '#ef4444',
    //   cancelButtonColor: '#64748b',
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     localStorage.clear(); // or removeItem('token'), etc.
    //     Swal.fire({
    //       title: 'Logged Out',
    //       text: 'You have been logged out successfully.',
    //       icon: 'success',
    //       confirmButtonColor: '#4361ee',
    //     }).then(() => {
    //       this.router.navigate(['/login']);
    //     });
    //   }
    // });
  }
}
