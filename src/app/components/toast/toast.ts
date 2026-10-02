import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <div *ngFor="let toast of toastService.toasts()" 
           class="pointer-events-auto p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 animate-fade-in transition-all"
           [ngClass]="{
             'bg-emerald-950/90 border-emerald-500/30 text-emerald-100': toast.type === 'success',
             'bg-rose-950/90 border-rose-500/30 text-rose-100': toast.type === 'error',
             'bg-amber-950/90 border-amber-500/30 text-amber-100': toast.type === 'warning',
             'bg-indigo-950/90 border-indigo-500/30 text-indigo-100': toast.type === 'info'
           }">
        
        <!-- Icon -->
        <div class="mt-0.5 shrink-0">
          <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <svg *ngIf="toast.type === 'warning'" class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <div class="flex-1">
          <h4 *ngIf="toast.title" class="font-bold text-sm tracking-tight mb-0.5">{{ toast.title }}</h4>
          <p class="text-xs opacity-90 leading-relaxed">{{ toast.message }}</p>
        </div>

        <button (click)="toastService.remove(toast.id)" 
                class="shrink-0 text-slate-400 hover:text-white transition-colors p-1 rounded-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
