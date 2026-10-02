import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { CatalogService } from '../../services/catalog.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Category, Product, ProductRequest } from '../../models/catalog.model';
import { DashboardStats } from '../../models/dashboard.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-10">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            👑 Administrator & Manager Studio
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Catalog Management Studio</h1>
          <p class="text-sm text-slate-400 mt-1">
            Perform product CRUD, inspect financial inventory metrics, and configure categories.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="openAddProductModal()" class="btn btn-primary text-xs py-2.5 px-4 flex items-center gap-2 shadow-lg shadow-indigo-600/30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add New Product
          </button>
        </div>
      </div>

      <!-- Financial & Catalog Health KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Total Inventory Valuation -->
        <div class="glass-card p-6 border-indigo-500/30 space-y-2 relative overflow-hidden">
          <div class="text-xs font-bold text-indigo-400 uppercase tracking-wider">Total Inventory Value</div>
          <div class="text-3xl font-black font-mono text-white">
            ₹{{ (stats()?.totalInventoryValue || 0) | number:'1.2-2' }}
          </div>
          <div class="text-[11px] text-slate-400">Calculated across active stock</div>
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <!-- Total Products Listed -->
        <div class="glass-card p-6 border-cyan-500/30 space-y-2 relative overflow-hidden">
          <div class="text-xs font-bold text-cyan-400 uppercase tracking-wider">Total Active SKUs</div>
          <div class="text-3xl font-black font-mono text-white">
            {{ stats()?.totalProducts || 0 }}
          </div>
          <div class="text-[11px] text-slate-400">Across {{ stats()?.totalCategories || 0 }} distinct categories</div>
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <!-- Total Physical Stock Units -->
        <div class="glass-card p-6 border-emerald-500/30 space-y-2 relative overflow-hidden">
          <div class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Warehouse Stock Count</div>
          <div class="text-3xl font-black font-mono text-white">
            {{ stats()?.totalStockUnits || 0 }}
          </div>
          <div class="text-[11px] text-slate-400">Physical units in storage</div>
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="glass-card p-6 border-amber-500/30 space-y-2 relative overflow-hidden">
          <div class="text-xs font-bold text-amber-400 uppercase tracking-wider">Low Stock Warnings</div>
          <div class="text-3xl font-black font-mono text-amber-400">
            {{ stats()?.lowStockCount || 0 }}
          </div>
          <div class="text-[11px] text-slate-400">{{ stats()?.outOfStockCount || 0 }} items currently out of stock</div>
          <div class="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

      </div>

      <!-- Category Breakdown & Recent Activities Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Category Distribution -->
        <div class="lg:col-span-7 glass-panel p-6 space-y-4">
          <h3 class="font-bold text-sm text-white uppercase tracking-wider flex items-center justify-between">
            <span>Category Valuation Distribution</span>
            <span class="text-xs text-slate-400 font-normal">Real-time breakdown</span>
          </h3>

          <div class="space-y-4 pt-2">
            <div *ngFor="let cat of stats()?.categoryDistribution" class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-slate-200">{{ cat.categoryName }} ({{ cat.productCount }} SKUs)</span>
                <span class="font-mono text-indigo-300 font-bold">₹{{ cat.inventoryValuation | number:'1.2-2' }}</span>
              </div>
              <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                     [style.width.%]="getCategoryValuationPercentage(cat.inventoryValuation)"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Audit Activities -->
        <div class="lg:col-span-5 glass-panel p-6 space-y-4">
          <h3 class="font-bold text-sm text-white uppercase tracking-wider flex items-center justify-between">
            <span>Recent Activity Trail</span>
            <span class="text-xs text-slate-400 font-normal">Latest updates</span>
          </h3>

          <div class="space-y-3 pt-2 max-h-72 overflow-y-auto pr-1">
            <div *ngFor="let act of stats()?.recentActivities" class="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">{{ act.title }}</span>
                <span class="text-[10px] text-slate-400 font-mono">{{ act.timestamp | date:'shortTime' }}</span>
              </div>
              <p class="text-[11px] text-slate-400">{{ act.description }}</p>
              <div class="text-[10px] text-indigo-400 font-mono">By: {{ act.user }}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- Product Management Studio Table -->
      <div class="glass-panel p-6 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 class="font-bold text-base text-white">Product Catalog Directory</h3>
            <p class="text-xs text-slate-400 mt-0.5">Manage products, change active statuses, or modify catalog details</p>
          </div>

          <div class="w-full sm:w-72">
            <input type="text" [(ngModel)]="searchKeyword" (input)="filterProducts()" placeholder="Filter by name, brand, SKU..."
                   class="input-control text-xs py-2 bg-slate-900/90 border-slate-700">
          </div>
        </div>

        <div class="table-container">
          <table class="custom-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>SKU</th>
                <th>Unit Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Active</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filteredProductList">
                <td>
                  <div class="flex items-center gap-3">
                    <img [src]="p.imageUrl" class="w-10 h-10 rounded-lg object-contain bg-slate-900 p-1 border border-slate-800" alt="Thumb">
                    <div>
                      <div class="font-bold text-white text-xs hover:text-indigo-400 cursor-pointer" [routerLink]="['/product', p.slug]">
                        {{ p.name }}
                      </div>
                      <div class="text-[10px] text-slate-400">{{ p.brand || 'Nexus' }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-xs text-indigo-300">{{ p.category.name }}</span>
                </td>
                <td>
                  <span class="sku-pill">{{ p.sku }}</span>
                </td>
                <td>
                  <span class="font-mono font-bold text-white text-xs">
                    ₹{{ (p.discountPrice || p.price) | number:'1.2-2' }}
                  </span>
                </td>
                <td>
                  <span class="font-mono font-semibold" [ngClass]="p.inventory?.stockQuantity === 0 ? 'text-rose-400' : 'text-slate-200'">
                    {{ p.inventory?.stockQuantity || 0 }}
                  </span>
                </td>
                <td>
                  <span *ngIf="p.inventory?.status === 'IN_STOCK'" class="badge-stock-pill badge-stock-in text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> In Stock
                  </span>
                  <span *ngIf="p.inventory?.status === 'LOW_STOCK'" class="badge-stock-pill badge-stock-low text-[10px] animate-pulse">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Low Stock
                  </span>
                  <span *ngIf="p.inventory?.status === 'OUT_OF_STOCK'" class="badge-stock-pill badge-stock-out text-[10px]">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Depleted
                  </span>
                </td>
                <td>
                  <button (click)="toggleActive(p)" [title]="p.active ? 'Click to deactivate' : 'Click to activate'"
                          class="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1.5"
                          [ngClass]="p.active ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700/50'">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="p.active ? 'bg-emerald-400' : 'bg-slate-500'"></span>
                    {{ p.active ? 'Active' : 'Disabled' }}
                  </button>
                </td>
                <td class="text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button (click)="openEditProductModal(p)" class="btn btn-secondary text-xs py-1 px-3 flex items-center gap-1">
                      <span>✏️</span> <span>Edit</span>
                    </button>
                    <button *ngIf="authService.isAdmin()" (click)="deleteProduct(p)" class="btn btn-danger text-xs py-1 px-2.5" title="Delete product">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add / Edit Product Modal -->
      <div *ngIf="showProductModal" class="modal-backdrop" (click)="closeOnBackdrop($event)">
        <div class="modal-container p-6 sm:p-8 animate-fade-in" style="max-width: 650px;">
          <div class="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 class="font-bold text-white text-lg">
                {{ isEditingProduct ? 'Edit Catalog Product' : 'Create New Catalog Product' }}
              </h3>
              <p class="text-xs text-slate-400">Configure catalog properties, pricing, and initial inventory</p>
            </div>
            <button (click)="showProductModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form (ngSubmit)="saveProduct()" class="space-y-4 mt-4">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label-control">Product Name</label>
                <input type="text" [(ngModel)]="prodForm.name" name="name" required class="input-control" placeholder="e.g. iPad Pro M4 13-inch">
              </div>

              <div>
                <label class="label-control">SKU (Unique Identifier)</label>
                <input type="text" [(ngModel)]="prodForm.sku" name="sku" required class="input-control" placeholder="e.g. SKU-IPAD-M4">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="label-control">Category</label>
                <select [(ngModel)]="prodForm.categoryId" name="categoryId" required class="input-control">
                  <option *ngFor="let c of categories()" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>

              <div>
                <label class="label-control">Brand / Manufacturer</label>
                <input type="text" [(ngModel)]="prodForm.brand" name="brand" class="input-control" placeholder="Apple, Sony, etc.">
              </div>

              <div>
                <label class="label-control">Base Price (₹) *</label>
                <input type="number" step="0.01" [(ngModel)]="prodForm.price" name="price" required class="input-control" placeholder="999.00">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="label-control">Discount Price (₹)</label>
                <input type="number" step="0.01" [(ngModel)]="prodForm.discountPrice" name="discountPrice" class="input-control" placeholder="Leave blank if none">
              </div>

              <div *ngIf="!isEditingProduct">
                <label class="label-control">Initial Stock (Units)</label>
                <input type="number" [(ngModel)]="prodForm.initialStock" name="initialStock" class="input-control" placeholder="25">
              </div>

              <div>
                <label class="label-control">Low Stock Threshold</label>
                <input type="number" [(ngModel)]="prodForm.lowStockThreshold" name="lowStockThreshold" class="input-control" placeholder="10">
              </div>
            </div>

            <div>
              <label class="label-control">Product Image URL</label>
              <input type="text" [(ngModel)]="prodForm.imageUrl" name="imageUrl" class="input-control" placeholder="https://images.unsplash.com/...">
            </div>

            <div>
              <label class="label-control">Product Description & Specs</label>
              <textarea [(ngModel)]="prodForm.description" name="description" rows="3" class="input-control" placeholder="High-level specifications, materials, warranty, features..."></textarea>
            </div>

            <div class="flex items-center gap-6 pt-2">
              <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" [(ngModel)]="prodForm.featured" name="featured" class="accent-indigo-500 rounded">
                <span>Featured Showcase Item</span>
              </label>

              <label class="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input type="checkbox" [(ngModel)]="prodForm.active" name="active" class="accent-indigo-500 rounded">
                <span>Active in Public Catalog</span>
              </label>
            </div>

            <div class="flex justify-end gap-2 pt-4 border-t border-slate-800">
              <button type="button" (click)="showProductModal = false" class="btn btn-secondary text-xs">Cancel</button>
              <button type="submit" [disabled]="modalLoading" class="btn btn-primary text-xs">
                {{ isEditingProduct ? 'Save Changes' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  filteredProductList: Product[] = [];
  searchKeyword = '';

  showProductModal = false;
  isEditingProduct = false;
  selectedProductId: number | null = null;
  modalLoading = false;

  prodForm: ProductRequest = {
    name: '',
    sku: '',
    categoryId: 1,
    price: 99.99,
    discountPrice: undefined,
    brand: '',
    imageUrl: '',
    description: '',
    initialStock: 20,
    lowStockThreshold: 10,
    featured: false,
    active: true
  };

  constructor(
    private dashboardService: DashboardService,
    private catalogService: CatalogService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getDashboardStats().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.set(res.data);
        }
      }
    });

    this.categoryService.getCategories(false).subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.set(res.data);
          if (res.data.length > 0 && !this.prodForm.categoryId) {
            this.prodForm.categoryId = res.data[0].id;
          }
        }
      }
    });

    this.catalogService.getProducts({ size: 100, sortBy: 'id', sortDir: 'desc' }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.allProducts.set(res.data.content);
          this.filterProducts();
        }
      }
    });
  }

  filterProducts() {
    if (!this.searchKeyword.trim()) {
      this.filteredProductList = this.allProducts();
    } else {
      const kw = this.searchKeyword.toLowerCase().trim();
      this.filteredProductList = this.allProducts().filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.sku.toLowerCase().includes(kw) ||
        (p.brand && p.brand.toLowerCase().includes(kw))
      );
    }
  }

  getCategoryValuationPercentage(val: number): number {
    const total = this.stats()?.totalInventoryValue || 1;
    return Math.min(100, Math.round((val / total) * 100));
  }

  toggleActive(p: Product) {
    this.catalogService.toggleProductActive(p.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toastService.success(`Status updated for ${p.name}`);
          this.loadData();
        }
      }
    });
  }

  openAddProductModal() {
    this.isEditingProduct = false;
    this.selectedProductId = null;
    this.prodForm = {
      name: '',
      sku: 'SKU-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      categoryId: this.categories().length > 0 ? this.categories()[0].id : 1,
      price: 199.00,
      discountPrice: undefined,
      brand: 'Nexus Hardware',
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      description: 'High performance device with premium engineering and long-lasting battery life.',
      initialStock: 25,
      lowStockThreshold: 10,
      featured: false,
      active: true
    };
    this.showProductModal = true;
  }

  openEditProductModal(p: Product) {
    this.isEditingProduct = true;
    this.selectedProductId = p.id;
    this.prodForm = {
      name: p.name,
      sku: p.sku,
      categoryId: p.category.id,
      price: p.price,
      discountPrice: p.discountPrice,
      brand: p.brand || '',
      imageUrl: p.imageUrl,
      description: p.description,
      lowStockThreshold: p.inventory?.lowStockThreshold || 10,
      featured: p.featured,
      active: p.active
    };
    this.showProductModal = true;
  }

  saveProduct() {
    if (!this.prodForm.name || !this.prodForm.sku || !this.prodForm.price) {
      this.toastService.warning('Please fill in required fields (Name, SKU, Price).');
      return;
    }

    this.modalLoading = true;

    if (this.isEditingProduct && this.selectedProductId) {
      this.catalogService.updateProduct(this.selectedProductId, this.prodForm).subscribe({
        next: () => {
          this.toastService.success('Product updated successfully!');
          this.showProductModal = false;
          this.modalLoading = false;
          this.loadData();
        },
        error: (err) => {
          this.modalLoading = false;
          const msg = err.error?.message || 'Failed to update product.';
          this.toastService.error(msg);
        }
      });
    } else {
      this.catalogService.createProduct(this.prodForm).subscribe({
        next: () => {
          this.toastService.success('Product created successfully!');
          this.showProductModal = false;
          this.modalLoading = false;
          this.loadData();
        },
        error: (err) => {
          this.modalLoading = false;
          const msg = err.error?.message || 'Failed to create product.';
          this.toastService.error(msg);
        }
      });
    }
  }

  deleteProduct(p: Product) {
    if (confirm(`Are you sure you want to permanently delete "${p.name}"?`)) {
      this.catalogService.deleteProduct(p.id).subscribe({
        next: () => {
          this.toastService.success(`Product "${p.name}" deleted.`);
          this.loadData();
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to delete product.';
          this.toastService.error(msg);
        }
      });
    }
  }

  closeOnBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showProductModal = false;
    }
  }
}
