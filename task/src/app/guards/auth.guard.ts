import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = new AuthService(); // Get the instance of AuthService
  const router = new Router(); // Get the instance of Router

  const token = authService.getToken();
  const role = authService.getRole();

  // Check if the token exists
  if (!token) {
    Swal.fire({
      icon: 'error',
      title: 'Please Login!',
      text: 'You need to log in first to access this resource.',
      confirmButtonText: 'Back to Login',
    });

    router.navigate(['/login']);
    return false; // Prevent navigation
  }

  // Check if the role matches the required role for the route
  if (route.data['role'] && route.data['role'] !== role) {
    Swal.fire({
      icon: 'error',
      title: 'Access Denied!',
      text: 'You do not have permission to access this resource.',
      confirmButtonText: 'Back to Home',
    });

    router.navigate(['/']); // Redirect to home or any other page
    return false;
  }

  // If both token and role are correct, allow the navigation
  return true;
};
