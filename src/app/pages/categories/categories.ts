import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Category, CategoryRequest } from '../../models/catalog.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-10">
      
      <!-- Header Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            Catalog Taxonomy & Organization
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Product Categories</h1>
          <p class="text-sm text-slate-400 mt-1">Explore our hardware categories or manage classification hierarchies.</p>
        </div>

        <div *ngIf="authService.isAdmin()">
          <button (click)="openAddModal()" class="btn btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Category
          </button>
        </div>
      </div>

      <!-- Categories Grid -->
      <div *ngIf="loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="glass-card p-6 h-48 animate-pulse bg-slate-900/60 rounded-2xl"></div>
      </div>

      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let cat of categories()" class="glass-card flex flex-col justify-between overflow-hidden group">
          
          <!-- Banner Image Top -->
          <div class="h-36 relative overflow-hidden bg-slate-900">
            <img [src]="cat.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'" 
                 [alt]="cat.name"
                 class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                {{ cat.productCount || 0 }} Items Listed
              </span>
            </div>
          </div>

          <!-- Body Info -->
          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div>
              <h3 class="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                {{ cat.name }}
              </h3>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                {{ cat.description || 'Explore premium catalog selection in this collection.' }}
              </p>
            </div>

            <div class="pt-4 border-t border-slate-800 flex items-center justify-between">
              <a [routerLink]="['/catalog']" [queryParams]="{ category: cat.slug }" 
                 class="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Browse Products →
              </a>

              <div *ngIf="authService.isAdmin()" class="flex items-center gap-1">
                <button (click)="openEditModal(cat)" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs">
                  ✏️
                </button>
                <button (click)="deleteCategory(cat)" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 text-xs">
                  🗑️
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- Add / Edit Category Modal -->
      <div *ngIf="showModal" class="modal-backdrop" (click)="closeOnBackdrop($event)">
        <div class="modal-container p-6 animate-fade-in" style="max-width: 480px;">
          <div class="flex justify-between items-center pb-4 border-b border-slate-800">
            <h3 class="font-bold text-white text-base">
              {{ isEditing ? 'Edit Category' : 'Create New Category' }}
            </h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form (ngSubmit)="saveCategory()" class="space-y-4 mt-4">
            <div>
              <label class="label-control">Category Name</label>
              <input type="text" [(ngModel)]="catForm.name" name="name" required class="input-control" placeholder="e.g. Smart Home & IoT">
            </div>

            <div>
              <label class="label-control">Slug (URL identifier)</label>
              <input type="text" [(ngModel)]="catForm.slug" name="slug" class="input-control" placeholder="smart-home-iot (optional)">
            </div>

            <div>
              <label class="label-control">Banner Image URL</label>
              <input type="text" [(ngModel)]="catForm.bannerUrl" name="bannerUrl" class="input-control" placeholder="https://images.unsplash.com/photo-...">
            </div>

            <div>
              <label class="label-control">Description</label>
              <textarea [(ngModel)]="catForm.description" name="description" rows="3" class="input-control" placeholder="Brief category summary..."></textarea>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" (click)="showModal = false" class="btn btn-secondary text-xs">Cancel</button>
              <button type="submit" [disabled]="modalLoading" class="btn btn-primary text-xs">
                {{ isEditing ? 'Update Category' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  loading = signal(true);

  showModal = false;
  isEditing = false;
  selectedCategoryId: number | null = null;
  modalLoading = false;

  catForm: CategoryRequest = {
    name: '',
    slug: '',
    description: '',
    bannerUrl: '',
    active: true
  };

  constructor(
    private categoryService: CategoryService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoryService.getCategories(false).subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load categories.');
      }
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.selectedCategoryId = null;
    this.catForm = {
      name: '',
      slug: '',
      description: '',
      bannerUrl: '',
      active: true
    };
    this.showModal = true;
  }

  openEditModal(cat: Category) {
    this.isEditing = true;
    this.selectedCategoryId = cat.id;
    this.catForm = {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      bannerUrl: cat.bannerUrl,
      active: cat.active
    };
    this.showModal = true;
  }

  saveCategory() {
    if (!this.catForm.name) {
      this.toastService.warning('Category name is required.');
      return;
    }

    this.modalLoading = true;

    if (this.isEditing && this.selectedCategoryId) {
      this.categoryService.updateCategory(this.selectedCategoryId, this.catForm).subscribe({
        next: () => {
          this.toastService.success('Category updated successfully!');
          this.showModal = false;
          this.modalLoading = false;
          this.loadCategories();
        },
        error: (err) => {
          this.modalLoading = false;
          const msg = err.error?.message || 'Failed to update category.';
          this.toastService.error(msg);
        }
      });
    } else {
      this.categoryService.createCategory(this.catForm).subscribe({
        next: () => {
          this.toastService.success('Category created successfully!');
          this.showModal = false;
          this.modalLoading = false;
          this.loadCategories();
        },
        error: (err) => {
          this.modalLoading = false;
          const msg = err.error?.message || 'Failed to create category.';
          this.toastService.error(msg);
        }
      });
    }
  }

  deleteCategory(cat: Category) {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      this.categoryService.deleteCategory(cat.id).subscribe({
        next: () => {
          this.toastService.success(`Category "${cat.name}" deleted.`);
          this.loadCategories();
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to delete category.';
          this.toastService.error(msg);
        }
      });
    }
  }

  closeOnBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showModal = false;
    }
  }
}
