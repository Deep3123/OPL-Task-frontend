import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.isAdmin()); // Add isAdmin subject
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {}

  // Private method to check if the token and role exist in localStorage
  private hasToken(): boolean {
    if (this.isBrowser()) {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      return !!token && !!role; // Return true if both token and role are present
    }
    return false;
  }

  // Private method to check if the user is an admin
  private isAdmin(): boolean {
    if (this.isBrowser()) {
      const role = localStorage.getItem("role");
      return role === "ADMIN"; // Return true if the role is ADMIN
    }
    return false;
  }

  // Helper method to check if the code is running in the browser
  private isBrowser(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined"
    );
  }

  // Login method to store token and role in localStorage
  login(token: string, role: string): void {
    if (this.isBrowser()) {
      localStorage.setItem("token", token); // Store token
      localStorage.setItem("role", role); // Store role
      this.isLoggedInSubject.next(true); // Update login status
      this.isAdminSubject.next(this.isAdmin()); // Update admin status
    }
  }

  // Logout method to clear token and role from localStorage
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem("token"); // Remove token
      localStorage.removeItem("role"); // Remove role
      this.isLoggedInSubject.next(false); // Update login status
      this.isAdminSubject.next(false); // Update admin status
    }
  }

  // Get the stored token from localStorage
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem("token");
    }
    return null;
  }

  // Get the stored role from localStorage
  getRole(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem("role");
    }
    return null;
  }

  // Check if the user is authenticated by checking the token
  isAuthenticated(): boolean {
    return !!this.getToken(); // Return true if the token exists
  }
}
