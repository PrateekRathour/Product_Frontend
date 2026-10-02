import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string, duration: number = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, type, title, message, duration };

    this.toasts.update(current => [...current, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title?: string) {
    this.show('success', message, title || 'Success');
  }

  error(message: string, title?: string) {
    this.show('error', message, title || 'Error');
  }

  info(message: string, title?: string) {
    this.show('info', message, title || 'Notice');
  }

  warning(message: string, title?: string) {
    this.show('warning', message, title || 'Warning');
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
