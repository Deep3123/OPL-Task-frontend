import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  user: any;

  ngOnInit(): void {
    const userData = localStorage.getItem('user');

    // console.log('User data from localStorage:', userData); // 🔍 Debug log

    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      // Optional: redirect to login if no user found
      console.warn('No user found in localStorage.');
      // Optionally redirect:
      // this.router.navigate(['/login']);
    }
  }

  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.trim().split(' ');
    const initials = nameParts
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase())
      .join('');
    return initials;
  }
}
