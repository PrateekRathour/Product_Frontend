import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="closeOnBackdrop($event)">
      <div class="modal-container p-6 sm:p-8 animate-fade-in" style="max-width: 460px;">
        
        <!-- Header -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1]"></span>
              {{ isSignUp ? 'Create Nexus Account' : 'Welcome Back' }}
            </h2>
            <p class="text-xs text-slate-400 mt-1">
              {{ isSignUp ? 'Register to manage or explore the product catalog' : 'Sign in to access role-based features' }}
            </p>
          </div>
          <button (click)="close()" class="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Quick Demo Switcher -->
        <div *ngIf="!isSignUp" class="my-4 p-3.5 bg-slate-900/90 rounded-xl border border-slate-800/80">
          <div class="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            1-Click Demo Accounts
          </div>
          <div class="grid grid-cols-3 gap-2">
            <button (click)="fillDemo('admin', 'Admin@1234')" 
                    class="py-1.5 px-2 rounded-lg text-xs font-medium bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-500/30 transition-all text-center">
              👑 Admin
            </button>
            <button (click)="fillDemo('manager', 'Manager@1234')" 
                    class="py-1.5 px-2 rounded-lg text-xs font-medium bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 transition-all text-center">
              📦 Manager
            </button>
            <button (click)="fillDemo('user', 'User@1234')" 
                    class="py-1.5 px-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-center">
              👤 User
            </button>
          </div>
        </div>

        <!-- Form -->
        <form (ngSubmit)="submit()" class="space-y-4 mt-4">
          
          <div *ngIf="isSignUp">
            <label class="label-control">Full Name</label>
            <input type="text" [(ngModel)]="fullName" name="fullName" required 
                   placeholder="e.g. Alex Morgan" class="input-control" />
          </div>

          <div>
            <label class="label-control">Username</label>
            <input type="text" [(ngModel)]="username" name="username" required 
                   placeholder="Enter username" class="input-control" />
          </div>

          <div *ngIf="isSignUp">
            <label class="label-control">Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" required 
                   placeholder="name@company.com" class="input-control" />
          </div>

          <div>
            <label class="label-control">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required 
                   placeholder="••••••••" class="input-control" />
          </div>

          <div *ngIf="isSignUp">
            <label class="label-control">Select Role</label>
            <select [(ngModel)]="selectedRole" name="selectedRole" class="input-control">
              <option value="ROLE_USER">Customer / Viewer (ROLE_USER)</option>
              <option value="ROLE_MANAGER">Inventory Manager (ROLE_MANAGER)</option>
              <option value="ROLE_ADMIN">System Administrator (ROLE_ADMIN)</option>
            </select>
          </div>

          <button type="submit" [disabled]="loading" class="btn btn-primary w-full py-3 mt-2 font-bold tracking-wide">
            <span *ngIf="loading" class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isSignUp ? 'Create Account' : 'Sign In to Portal' }}
          </button>
        </form>

        <!-- Switch mode footer -->
        <div class="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <span *ngIf="!isSignUp">
            Don't have an account? 
            <button (click)="isSignUp = true" class="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1">
              Sign Up
            </button>
          </span>
          <span *ngIf="isSignUp">
            Already have an account? 
            <button (click)="isSignUp = false" class="text-indigo-400 hover:text-indigo-300 font-semibold underline ml-1">
              Sign In
            </button>
          </span>
        </div>

      </div>
    </div>
  `
})
export class AuthModalComponent {
  @Output() closed = new EventEmitter<void>();

  isSignUp = false;
  username = '';
  password = '';
  fullName = '';
  email = '';
  selectedRole = 'ROLE_USER';
  loading = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  fillDemo(u: string, p: string) {
    this.username = u;
    this.password = p;
    this.toastService.info(`Loaded demo credentials for ${u}`, 'Demo Autofill');
  }

  submit() {
    if (!this.username || !this.password) {
      this.toastService.warning('Please enter both username and password.');
      return;
    }

    this.loading = true;

    if (this.isSignUp) {
      if (!this.fullName || !this.email) {
        this.toastService.warning('Please fill in all fields.');
        this.loading = false;
        return;
      }

      this.authService.register({
        username: this.username,
        email: this.email,
        fullName: this.fullName,
        password: this.password,
        roles: [this.selectedRole]
      }).subscribe({
        next: () => {
          this.toastService.success('Registration successful! Please sign in with your credentials.');
          this.isSignUp = false;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.message || 'Registration failed. Username or email may already be taken.';
          this.toastService.error(msg);
        }
      });
    } else {
      this.authService.login({
        username: this.username,
        password: this.password
      }).subscribe({
        next: (res) => {
          this.loading = false;
          this.toastService.success(`Welcome back, ${res.data.fullName}!`, 'Authentication');
          this.closed.emit();
        },
        error: (err) => {
          this.loading = false;
          const msg = err.error?.message || 'Invalid username or password.';
          this.toastService.error(msg, 'Sign In Error');
        }
      });
    }
  }

  close() {
    this.closed.emit();
  }

  closeOnBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close();
    }
  }
}
