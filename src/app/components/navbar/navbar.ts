import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { AuthModalComponent } from '../auth-modal/auth-modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthModalComponent],
  template: `
    <header class="sticky top-0 z-50 w-full backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand Section -->
          <div class="flex items-center gap-6">
            <a routerLink="/catalog" class="flex items-center gap-3.5 group cursor-pointer" style="text-decoration: none;">
              <div class="relative flex items-center justify-center">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
                  <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                    <svg width="20" height="20" class="text-indigo-600 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                </div>
                <!-- Status ring pulse -->
                <span class="absolute -top-1 -right-1 flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
                </span>
              </div>

              <div class="flex items-center">
                <span class="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap">
                  Lala Ji <span class="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Mobie Wale</span>
                </span>
              </div>
            </a>

            <!-- Desktop Navigation Links (Segmented Pill Style) -->
            <nav class="hidden lg:flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md ml-3">
              <a routerLink="/catalog" routerLinkActive="active-nav-pill" 
                 class="nav-pill-link">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
                Catalog
              </a>

              <a routerLink="/categories" routerLinkActive="active-nav-pill" 
                 class="nav-pill-link">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                Categories
              </a>

              <!-- Protected Management links -->
              <a *ngIf="authService.isManager()" routerLink="/inventory" routerLinkActive="active-nav-pill-emerald" 
                 class="nav-pill-link text-emerald-400 hover:text-emerald-300">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                Inventory Hub
              </a>

              <a *ngIf="authService.isManager()" routerLink="/admin" routerLinkActive="active-nav-pill-purple" 
                 class="nav-pill-link text-purple-400 hover:text-purple-300">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Management Studio
              </a>
            </nav>
          </div>

          <!-- User & Action Controls -->
          <div class="flex items-center gap-3">
            
            <!-- Swagger Quick Launch -->
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" title="Explore OpenAPI 3.0 Documentation"
               class="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-emerald-300 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 transition-all shadow-sm">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Swagger API
            </a>

            <!-- Demo Account Switcher Button (Direct Dropdown) -->
            <div class="relative">
              <button (click)="toggleRoleDropdown()" 
                      title="Quick Switch Demo Account"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white transition-all">
                <span class="text-amber-400 font-bold">⚡ Demo Switcher</span>
                <svg width="12" height="12" class="text-slate-400 transition-transform" [class.rotate-180]="showRoleDropdown()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- Role Switcher Dropdown Menu -->
              <div *ngIf="showRoleDropdown()" 
                   class="role-dropdown-menu space-y-1 animate-fade-in">
                
                <div class="px-3 py-2 border-b border-slate-800">
                  <span class="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                    Switch Test Persona
                  </span>
                </div>

                <!-- Admin Option -->
                <button (click)="quickLogin('admin', 'Admin@1234')" 
                        class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-950/50 hover:border hover:border-indigo-500/30 text-left transition-all group">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                      👑
                    </div>
                    <div>
                      <div class="text-xs font-bold text-white group-hover:text-indigo-300">Admin Account</div>
                      <div class="text-[10px] text-slate-400">Full CRUD, Products & Inventory</div>
                    </div>
                  </div>
                  <span *ngIf="authService.isAdmin()" class="text-xs text-indigo-400">✓</span>
                </button>

                <!-- Manager Option -->
                <button (click)="quickLogin('manager', 'Manager@1234')" 
                        class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-950/50 hover:border hover:border-emerald-500/30 text-left transition-all group">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                      📦
                    </div>
                    <div>
                      <div class="text-xs font-bold text-white group-hover:text-emerald-300">Inventory Manager</div>
                      <div class="text-[10px] text-slate-400">Stock adjustments & warehouse</div>
                    </div>
                  </div>
                  <span *ngIf="!authService.isAdmin() && authService.isManager()" class="text-xs text-emerald-400">✓</span>
                </button>

                <!-- Customer Option -->
                <button (click)="quickLogin('user', 'User@1234')" 
                        class="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-cyan-950/50 hover:border hover:border-cyan-500/30 text-left transition-all group">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
                      🛍️
                    </div>
                    <div>
                      <div class="text-xs font-bold text-white group-hover:text-cyan-300">Demo Customer</div>
                      <div class="text-[10px] text-slate-400">Catalog shopping & specs view</div>
                    </div>
                  </div>
                  <span *ngIf="!authService.isAdmin() && !authService.isManager() && authService.isLoggedIn()" class="text-xs text-cyan-400">✓</span>
                </button>

                <div class="pt-1.5 border-t border-slate-800 flex items-center justify-between px-2">
                  <button (click)="openAuthModal()" class="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold py-1">
                    Manual Sign In / Register →
                  </button>
                  <button *ngIf="authService.isLoggedIn()" (click)="authService.logout(); showRoleDropdown.set(false)" class="text-[11px] text-rose-400 hover:text-rose-300 font-semibold py-1">
                    Sign Out
                  </button>
                </div>

              </div>
            </div>

            <!-- Active User Profile Display -->
            <div *ngIf="authService.isLoggedIn(); else guestCTA" class="flex items-center gap-2 pl-2 sm:pl-3 pr-1.5 py-1 bg-slate-900/90 rounded-xl border border-slate-800/90 shadow-sm">
              <img [src]="authService.currentUser()?.avatarUrl" 
                   style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;"
                   class="border border-indigo-500/30 shrink-0" 
                   alt="Avatar" />
              
              <div class="hidden sm:flex flex-col text-left">
                <span class="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {{ authService.currentUser()?.fullName }}
                </span>
                <div class="flex items-center gap-1 mt-0.5">
                  <span *ngIf="authService.isAdmin()" class="badge badge-role-admin text-[9px] py-0 px-1.5">Admin</span>
                  <span *ngIf="!authService.isAdmin() && authService.isManager()" class="badge badge-role-manager text-[9px] py-0 px-1.5">Manager</span>
                  <span *ngIf="!authService.isAdmin() && !authService.isManager()" class="badge badge-role-user text-[9px] py-0 px-1.5">Customer</span>
                </div>
              </div>

              <button (click)="authService.logout()" title="Sign Out" 
                      class="ml-1 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>

            <ng-template #guestCTA>
              <button (click)="openAuthModal()" 
                      class="btn btn-primary py-2 px-4 shadow-lg shadow-indigo-600/30 text-xs sm:text-sm font-bold">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Sign In
              </button>
            </ng-template>

            <!-- Mobile Menu Hamburger Button -->
            <button (click)="toggleMobileMenu()" class="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path *ngIf="!showMobileMenu()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path *ngIf="showMobileMenu()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

          </div>

        </div>

        <!-- Mobile Drawer Navigation -->
        <div *ngIf="showMobileMenu()" class="lg:hidden pb-4 pt-2 border-t border-slate-800/80 animate-fade-in space-y-1">
          <a routerLink="/catalog" (click)="showMobileMenu.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900">
            Catalog
          </a>
          <a routerLink="/categories" (click)="showMobileMenu.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900">
            Categories
          </a>
          <a *ngIf="authService.isManager()" routerLink="/inventory" (click)="showMobileMenu.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-950/30">
            Inventory Hub
          </a>
          <a *ngIf="authService.isManager()" routerLink="/admin" (click)="showMobileMenu.set(false)"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-purple-400 hover:bg-purple-950/30">
            Management Studio
          </a>
        </div>

      </div>
    </header>

    <!-- Auth Modal Container -->
    <app-auth-modal *ngIf="showAuthModal()" (closed)="showAuthModal.set(false)"></app-auth-modal>
  `
})
export class NavbarComponent {
  showAuthModal = signal(false);
  showRoleDropdown = signal(false);
  showMobileMenu = signal(false);

  constructor(
    public authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  openAuthModal() {
    this.showRoleDropdown.set(false);
    this.showAuthModal.set(true);
  }

  toggleRoleDropdown() {
    this.showRoleDropdown.update(v => !v);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(v => !v);
  }

  quickLogin(username: string, password: string) {
    this.authService.login({ username, password }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.toastService.success(`Switched role to ${res.data.roles[0].replace('ROLE_', '')}: ${res.data.fullName}`, 'Account Switched');
          this.showRoleDropdown.set(false);
        }
      },
      error: () => {
        this.toastService.error('Failed to quick login. Please check credentials.', 'Auth Error');
      }
    });
  }
}
