import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AuthModalComponent],
  template: `
    <header class="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-8">
            <a routerLink="/catalog" class="flex items-center gap-3 group" style="text-decoration: none;">
              <div style="width: 40px; height: 40px; min-width: 40px;" class="rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all flex items-center justify-center">
                <div style="width: 100%; height: 100%;" class="bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <svg width="20" height="20" class="text-indigo-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                    Nexus<span class="text-indigo-400 font-black">Catalog</span>
                  </span>
                  <span class="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest">
                    v1.0
                  </span>
                </div>
                <span class="text-[11px] text-slate-400 tracking-wider font-mono">Spring Boot • Angular • MySQL</span>
              </div>
            </a>

            <!-- Navigation Links (Desktop) -->
            <nav class="hidden md:flex items-center gap-1.5 ml-4">
              <a routerLink="/catalog" routerLinkActive="bg-indigo-600/10 text-indigo-300 border-indigo-500/30" 
                 class="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
                Catalog
              </a>

              <a routerLink="/categories" routerLinkActive="bg-indigo-600/10 text-indigo-300 border-indigo-500/30" 
                 class="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent transition-all flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </svg>
                Categories
              </a>

              <!-- Protected Management links -->
              <a *ngIf="authService.isManager()" routerLink="/inventory" routerLinkActive="bg-emerald-600/15 text-emerald-300 border-emerald-500/40" 
                 class="px-3.5 py-2 rounded-lg text-sm font-semibold text-emerald-400 hover:text-emerald-200 hover:bg-emerald-950/40 border border-emerald-500/20 transition-all flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                Inventory Hub
              </a>

              <a *ngIf="authService.isManager()" routerLink="/admin" routerLinkActive="bg-purple-600/15 text-purple-300 border-purple-500/40" 
                 class="px-3.5 py-2 rounded-lg text-sm font-semibold text-purple-400 hover:text-purple-200 hover:bg-purple-950/40 border border-purple-500/20 transition-all flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Management Studio
              </a>
            </nav>
          </div>

          <!-- User Profile & Action CTA -->
          <div class="flex items-center gap-3">
            
            <!-- Swagger UI quick launch link -->
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" title="Open Swagger OpenAPI Documentation"
               class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              <svg width="14" height="14" class="text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
              </svg>
              Swagger API
            </a>

            <!-- Authenticated Profile -->
            <div *ngIf="authService.isLoggedIn(); else guestBlock" class="flex items-center gap-3">
              
              <div class="flex items-center gap-2.5 pl-3 pr-2 py-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <img [src]="authService.currentUser()?.avatarUrl" 
                     style="width: 32px; height: 32px; border-radius: 8px; object-fit: cover;"
                     class="border border-indigo-500/40" 
                     alt="Avatar" />
                
                <div class="hidden sm:flex flex-col text-left">
                  <span class="text-xs font-bold text-white leading-tight">
                    {{ authService.currentUser()?.fullName }}
                  </span>
                  <div class="flex items-center gap-1 mt-0.5">
                    <span *ngIf="authService.isAdmin()" class="badge badge-role-admin text-[9px] py-0 px-1.5">Admin</span>
                    <span *ngIf="!authService.isAdmin() && authService.isManager()" class="badge badge-role-manager text-[9px] py-0 px-1.5">Manager</span>
                    <span *ngIf="!authService.isAdmin() && !authService.isManager()" class="badge badge-role-user text-[9px] py-0 px-1.5">Customer</span>
                  </div>
                </div>

                <button (click)="authService.logout()" title="Sign Out" 
                        class="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                </button>
              </div>

            </div>

            <!-- Guest Action -->
            <ng-template #guestBlock>
              <button (click)="openAuthModal()" 
                      class="btn btn-primary py-2 px-4 shadow-lg shadow-indigo-500/20 text-xs sm:text-sm">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Sign In / Demo
              </button>
            </ng-template>

          </div>

        </div>
      </div>
    </header>

    <!-- Auth Modal Container -->
    <app-auth-modal *ngIf="showAuthModal()" (closed)="showAuthModal.set(false)"></app-auth-modal>
  `
})
export class NavbarComponent {
  showAuthModal = signal(false);

  constructor(public authService: AuthService, private router: Router) {}

  openAuthModal() {
    this.showAuthModal.set(true);
  }
}
