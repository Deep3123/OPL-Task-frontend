import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { authGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {
    path: 'reset-password/:username/:timestamp/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // ✅ default redirect
      { path: 'dashboard', component: DashboardComponent },
      { path: 'user-list', component: UserListComponent },
    ],
  },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirect to login by default
  { path: '**', component: ErrorPageComponent },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
