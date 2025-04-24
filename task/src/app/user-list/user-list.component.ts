// user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { UserAuthServiceService } from '../services/user-auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  accessRole: string;
  profileImage?: string;
  contactNumber?: string;
  address?: string;
  pinCode?: string;
  dob?: string;
  createdAt?: string;
  status?: string;
}

interface ApiResponse {
  content: User[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Component({
  selector: 'app-user-list',
  standalone: false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentPage = 0;
  pageSize = 10;
  totalUsers = 0;
  totalPages = 0;
  searchText = '';
  isLoading = false;
  Math = Math; // Make Math available in template

  constructor(
    private http: HttpClient,
    private service: UserAuthServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users from backend API
  loadUsers(): void {
    this.isLoading = true;
    const params = new HttpParams()
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString())
      .set('role', 'user'); // Filter by 'user' role

    this.http
      .get<ApiResponse>('http://localhost:8080/get-all-users-pagewise', {
        params,
      })
      .subscribe({
        next: (res) => {
          console.log(res.content);
          this.users = res.content;
          this.totalUsers = res.totalElements;
          this.totalPages = res.totalPages;
          this.filteredUsers = this.users;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error!', 'Failed to fetch users.', 'error');
          console.error('Error fetching users:', err);
        },
      });
  }

  // Local search filter - searches only in the current page
  onSearch(): void {
    const term = this.searchText.trim().toLowerCase();
    if (term) {
      this.filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.username.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    } else {
      this.filteredUsers = this.users;
    }
  }

  // Global search - searches across all users in the database
  performGlobalSearch(): void {
    if (!this.searchText || this.searchText.trim() === '') {
      // If search text is empty, load normal paginated data
      this.loadUsers();
      return;
    }

    this.isLoading = true;

    // Reset to first page when performing a new search
    this.currentPage = 0;

    const params = new HttpParams()
      .set('searchTerm', this.searchText.trim())
      .set('page', this.currentPage.toString())
      .set('size', this.pageSize.toString());

    this.http
      .get<ApiResponse>('http://localhost:8080/search-users', { params })
      .subscribe({
        next: (res) => {
          this.users = res.content;
          this.totalUsers = res.totalElements;
          this.totalPages = res.totalPages;
          this.filteredUsers = this.users;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          Swal.fire('Error!', err.error.message, 'error');
          console.error('Error searching users:', err);
        },
      });
  }

  // Page change handler
  onPageChange(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;

    // If we're in a search context, use search endpoint
    if (this.searchText && this.searchText.trim() !== '') {
      const params = new HttpParams()
        .set('searchTerm', this.searchText.trim())
        .set('page', this.currentPage.toString())
        .set('size', this.pageSize.toString());

      this.isLoading = true;

      this.http
        .get<ApiResponse>('http://localhost:8080/search-users', { params })
        .subscribe({
          next: (res) => {
            this.users = res.content;
            this.totalUsers = res.totalElements;
            this.totalPages = res.totalPages;
            this.filteredUsers = this.users;
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire('Error!', 'Failed to search users.', 'error');
            console.error('Error searching users:', err);
          },
        });
    } else {
      this.loadUsers(); // Standard pagination if not searching
    }
  }

  // Page size change handler
  onPageSizeChange(): void {
    this.currentPage = 0; // Reset to first page when changing page size

    if (this.searchText && this.searchText.trim() !== '') {
      this.performGlobalSearch();
    } else {
      this.loadUsers();
    }
  }

  // Get initials from name for avatar
  getInitials(name: string): string {
    if (!name) return '?';

    const nameParts = name.trim().split(' ');
    const initials = nameParts
      .filter((part) => part.length > 0)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join('');

    return initials;
  }

  // Generate array of visible page numbers for pagination
  getVisiblePageNumbers(): number[] {
    const visiblePages = [];
    const totalVisiblePages = 5; // Number of page buttons to show

    if (this.totalPages <= totalVisiblePages) {
      // If total pages are less than visible count, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      // Always include first page
      visiblePages.push(1);

      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 3);

      // Adjust start and end based on current position
      if (this.currentPage < 3) {
        endPage = Math.min(totalVisiblePages - 1, this.totalPages - 1);
      } else if (this.currentPage > this.totalPages - 3) {
        startPage = Math.max(2, this.totalPages - (totalVisiblePages - 2));
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        visiblePages.push(-1); // Use -1 to represent ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < this.totalPages - 1) {
        visiblePages.push(-2); // Use -2 to represent ellipsis
      }

      // Always include last page
      visiblePages.push(this.totalPages);
    }

    return visiblePages;
  }

  viewUser(user: User): void {
    Swal.fire({
      title: user.name,
      html: `
        <div class="user-details-modal">
          <div class="user-info-grid">
            <div class="user-info-row">
              <span class="info-label">Username:</span>
              <span class="info-value">${user.username}</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${user.email}</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">Role:</span>
              <span class="info-value">${user.accessRole}</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">Contact:</span>
              <span class="info-value">${user.contactNumber || 'N/A'}</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">Date of Birth:</span>
              <span class="info-value">${
                user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'
              }</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">${user.address || 'N/A'}</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">PIN Code:</span>
              <span class="info-value">${user.pinCode || 'N/A'}</span>
            </div>
            <div class="user-info-row">
              <span class="info-label">Status:</span>
              <span class="info-value">${user.status || 'Active'}</span>
            </div>
            
          </div>
        </div>
      `,
      customClass: {
        container: 'user-modal-container',
        popup: 'user-modal-popup',
        htmlContainer: 'user-modal-html-container',
      },
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#3f51b5',
      imageUrl: user.profileImage || '',
      imageHeight: user.profileImage ? 100 : 0,
      imageWidth: user.profileImage ? 100 : 0,
      imageAlt: 'Profile Image',
    });

    // Add custom styling for the SweetAlert modal
    const style = document.createElement('style');
    style.textContent = `
      .user-details-modal {
        margin-top: 1rem;
        text-align: left;
      }
      .user-info-grid {
        display: grid;
        gap: 0.5rem;
      }
      .user-info-row {
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 1rem;
        align-items: center;
      }
      .info-label {
        font-weight: 600;
        color: #4a5568;
      }
      .info-value {
        color: #2d3748;
      }
      .user-modal-container {
        z-index: 1200;
      }
      .user-modal-popup {
        width: 480px;
        max-width: 95vw;
        padding: 2rem;
        border-radius: 8px;
      }
      .user-modal-html-container {
        margin: 1rem 0 0;
      }
    `;
    document.head.appendChild(style);
  }

  editUser(user: any): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '600px', // Adjust dialog width as needed
      maxHeight: '80vh',
      data: user, // Pass the selected user data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // After successful update, you can refresh the list or take another action
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User): void {
    Swal.fire({
      title: 'Delete User',
      html: `Are you sure you want to delete <strong>${user.name}</strong>?<br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f56565',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Yes, delete user',
      cancelButtonText: 'Cancel',
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteUser(user.username).subscribe({
          next: () => {
            Swal.fire({
              title: 'User Deleted',
              text: `${user.name} has been successfully deleted.`,
              icon: 'success',
              confirmButtonColor: '#3f51b5',
            });
            // Refresh the user list
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            Swal.fire({
              title: 'Error',
              text: `An error occurred while deleting ${user.name}.`,
              icon: 'error',
              confirmButtonColor: '#3f51b5',
            });
          },
        });
      }
    });
  }

  // Add this method to the UserListComponent class
  resetSearch(): void {
    // Clear the search text
    this.searchText = '';

    // Reset to first page
    this.currentPage = 0;

    // Reload users
    this.loadUsers();
  }
}
