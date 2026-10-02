import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Category, InventoryStatus, Product, ProductFilter } from '../../models/catalog.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      <!-- Hero Showcase Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-8 sm:p-12 mb-10 shadow-2xl">
        <div class="absolute -right-16 -top-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
            <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Real-Time Catalog & Inventory
          </div>
          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Discover Cutting-Edge <span class="gradient-primary">Products & Hardware</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-300 mb-8 leading-relaxed">
            Browse our multi-category high-performance catalog. Real-time warehouse inventory tracking with automated stock status recalculation and 3-tier architecture.
          </p>

          <!-- Search Bar -->
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="relative flex-1">
              <svg width="20" height="20" class="text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input type="text" [(ngModel)]="filterKeyword" (keyup.enter)="applyFilters()" 
                     placeholder="Search products by title, SKU, brand, or specifications..."
                     class="input-control pl-12 py-3.5 text-base bg-slate-900/90 border-slate-700 shadow-inner" />
              <button *ngIf="filterKeyword" (click)="filterKeyword = ''; applyFilters()" 
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <button (click)="applyFilters()" class="btn btn-primary px-8 py-3.5 font-bold shadow-lg shadow-indigo-600/30">
              Search Catalog
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Category Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        <button (click)="selectCategory(null)"
                [ngClass]="selectedCategoryId === null ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'"
                class="px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap">
          🌐 All Categories ({{ totalElements() }})
        </button>
        <button *ngFor="let cat of categories()" (click)="selectCategory(cat.id)"
                [ngClass]="selectedCategoryId === cat.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'"
                class="px-4 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap flex items-center gap-2">
          <span>{{ cat.name }}</span>
          <span class="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-400">{{ cat.productCount || 0 }}</span>
        </button>
      </div>

      <!-- Main Layout: Sidebar Filters + Products Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- Sidebar Filter Drawer -->
        <aside class="lg:col-span-1 space-y-6">
          <div class="glass-panel p-6 space-y-6 sticky top-28">
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 class="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                <svg width="16" height="16" class="text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                Filters & Sorting
              </h3>
              <button (click)="resetFilters()" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline">
                Reset
              </button>
            </div>

            <!-- Sort By -->
            <div>
              <label class="label-control">Sort Order</label>
              <select [(ngModel)]="sortByOption" (change)="onSortChange()" class="input-control text-xs">
                <option value="id_desc">✨ Newest First</option>
                <option value="price_asc">💵 Price: Low to High</option>
                <option value="price_desc">💎 Price: High to Low</option>
                <option value="name_asc">🔤 Name: A to Z</option>
                <option value="rating_desc">⭐ Top Rated</option>
              </select>
            </div>

            <!-- Stock Availability -->
            <div>
              <label class="label-control">Stock Availability</label>
              <div class="space-y-2 text-xs">
                <label class="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input type="radio" name="stockFilter" [checked]="filterStatus === null" (change)="setStockFilter(null)" class="text-indigo-600 rounded">
                  <span>Show All Stock</span>
                </label>
                <label class="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input type="radio" name="stockFilter" [checked]="filterStatus === 'IN_STOCK'" (change)="setStockFilter('IN_STOCK')" class="text-emerald-500 rounded">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span> In Stock Only
                  </span>
                </label>
                <label class="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input type="radio" name="stockFilter" [checked]="filterStatus === 'LOW_STOCK'" (change)="setStockFilter('LOW_STOCK')" class="text-amber-500 rounded">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span> Low Stock Alert
                  </span>
                </label>
                <label class="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white">
                  <input type="radio" name="stockFilter" [checked]="filterStatus === 'OUT_OF_STOCK'" (change)="setStockFilter('OUT_OF_STOCK')" class="text-rose-500 rounded">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-rose-500"></span> Out of Stock
                  </span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="label-control mb-0">Max Price</label>
                <span class="text-xs font-mono text-indigo-300 font-bold">₹{{ maxPriceLimit | number:'1.0-0' }}</span>
              </div>
              <input type="range" min="1000" max="500000" step="5000" [(ngModel)]="maxPriceLimit" (change)="applyFilters()"
                     class="w-full accent-indigo-500 cursor-pointer">
              <div class="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>₹1,000</span>
                <span>₹5,00,000+</span>
              </div>
            </div>

            <!-- Featured items switch -->
            <div class="pt-2 border-t border-slate-800">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-xs font-medium text-slate-300">Featured Items Only</span>
                <input type="checkbox" [(ngModel)]="featuredOnly" (change)="applyFilters()" class="accent-indigo-500 rounded w-4 h-4 cursor-pointer">
              </label>
            </div>

            <!-- Active / Archived Toggle -->
            <div class="pt-2 border-t border-slate-800">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-xs font-medium text-slate-300">Include Inactive Catalog</span>
                <input type="checkbox" [(ngModel)]="includeInactive" (change)="applyFilters()" class="accent-indigo-500 rounded w-4 h-4 cursor-pointer">
              </label>
            </div>

          </div>
        </aside>

        <!-- Product Listings -->
        <main class="lg:col-span-3 space-y-6">
          
          <!-- Top Bar: Result count and View Mode -->
          <div class="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div class="text-xs text-slate-400">
              Showing <span class="font-bold text-white">{{ products().length }}</span> of <span class="font-bold text-white">{{ totalElements() }}</span> products
            </div>

            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-400">View:</span>
              <button (click)="viewMode = 'grid'" 
                      [ngClass]="viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'"
                      class="p-2 rounded-lg transition-all" title="Grid View">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button (click)="viewMode = 'list'" 
                      [ngClass]="viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'"
                      class="p-2 rounded-lg transition-all" title="List View">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Loading Skeleton -->
          <div *ngIf="loading()" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div *ngFor="let i of [1,2,3,4,5,6]" class="glass-card p-4 rounded-2xl animate-pulse space-y-4">
              <div class="w-full h-48 bg-slate-800 rounded-xl"></div>
              <div class="h-4 bg-slate-800 rounded w-3/4"></div>
              <div class="h-3 bg-slate-800 rounded w-1/2"></div>
              <div class="h-8 bg-slate-800 rounded w-full"></div>
            </div>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loading() && products().length === 0" class="glass-panel p-12 text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-white">No Products Found</h3>
            <p class="text-sm text-slate-400 max-w-sm mx-auto">
              We couldn't find any products matching your active search and filter criteria.
            </p>
            <button (click)="resetFilters()" class="btn btn-secondary px-6 py-2 text-xs">
              Clear All Filters
            </button>
          </div>

          <!-- Grid View of Products -->
          <div *ngIf="!loading() && viewMode === 'grid' && products().length > 0" 
               class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            
            <div *ngFor="let product of products()" 
                 class="glass-card flex flex-col justify-between overflow-hidden group">
              
              <!-- Product Image Box (Height strictly constrained) -->
              <div class="product-img-box">
                <img [src]="product.imageUrl" [alt]="product.name" />
                
                <!-- Status Badges Overlay -->
                <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span *ngIf="product.inventory?.status === 'IN_STOCK'" class="badge badge-in-stock">
                    In Stock ({{ product.inventory?.stockQuantity }})
                  </span>
                  <span *ngIf="product.inventory?.status === 'LOW_STOCK'" class="badge badge-low-stock">
                    Low Stock ({{ product.inventory?.stockQuantity }})
                  </span>
                  <span *ngIf="product.inventory?.status === 'OUT_OF_STOCK'" class="badge badge-out-of-stock">
                    Sold Out
                  </span>
                </div>

                <div class="absolute top-3 right-3">
                  <span *ngIf="product.featured" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ⭐ Featured
                  </span>
                </div>

                <div *ngIf="product.discountPrice" class="absolute bottom-3 left-3">
                  <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SALE
                  </span>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span class="font-medium text-indigo-400">{{ product.category.name }}</span>
                    <span class="sku-pill">{{ product.sku }}</span>
                  </div>

                  <a [routerLink]="['/product', product.slug]" 
                     class="font-bold text-base text-white hover:text-indigo-400 transition-colors line-clamp-1 block">
                    {{ product.name }}
                  </a>

                  <p class="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {{ product.description }}
                  </p>
                </div>

                <!-- Stock Bar Indicator -->
                <div *ngIf="product.inventory" class="space-y-1">
                  <div class="flex justify-between text-[10px] text-slate-400">
                    <span>Stock Level:</span>
                    <span class="font-mono font-semibold" 
                          [ngClass]="{
                            'text-emerald-400': product.inventory.status === 'IN_STOCK',
                            'text-amber-400': product.inventory.status === 'LOW_STOCK',
                            'text-rose-400': product.inventory.status === 'OUT_OF_STOCK'
                          }">
                      {{ product.inventory.stockQuantity }} units left
                    </span>
                  </div>
                  <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all"
                         [style.width.%]="getStockPercentage(product.inventory.stockQuantity)"
                         [ngClass]="{
                           'bg-emerald-500': product.inventory.status === 'IN_STOCK',
                           'bg-amber-500': product.inventory.status === 'LOW_STOCK',
                           'bg-rose-500': product.inventory.status === 'OUT_OF_STOCK'
                         }">
                    </div>
                  </div>
                </div>

                <!-- Price & Action -->
                <div class="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div class="flex items-baseline gap-2">
                      <span class="text-xl font-extrabold text-white price-tag">
                        ₹{{ (product.discountPrice || product.price) | number:'1.2-2' }}
                      </span>
                      <span *ngIf="product.discountPrice" class="text-xs text-slate-500 line-through price-tag">
                        ₹{{ product.price | number:'1.2-2' }}
                      </span>
                    </div>
                  </div>

                  <a [routerLink]="['/product', product.slug]" 
                     class="btn btn-secondary text-xs py-2 px-3.5 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition-all">
                    Details →
                  </a>
                </div>

              </div>

            </div>

          </div>

          <!-- List View of Products -->
          <div *ngIf="!loading() && viewMode === 'list' && products().length > 0" class="space-y-4">
            <div *ngFor="let product of products()" 
                 class="glass-card p-5 flex flex-col sm:flex-row items-center gap-6 group">
              
              <div style="width: 140px; height: 140px; min-width: 140px;" class="bg-slate-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                <img [src]="product.imageUrl" [alt]="product.name" style="max-width: 100%; max-height: 100%; object-fit: contain;" class="group-hover:scale-105 transition-transform" />
              </div>

              <div class="flex-1 space-y-2 w-full">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-indigo-400 font-semibold">{{ product.category.name }}</span>
                  <span class="text-slate-600">•</span>
                  <span class="sku-pill">{{ product.sku }}</span>
                  <span *ngIf="product.inventory?.status === 'IN_STOCK'" class="badge badge-in-stock text-[10px]">In Stock ({{ product.inventory?.stockQuantity }})</span>
                  <span *ngIf="product.inventory?.status === 'LOW_STOCK'" class="badge badge-low-stock text-[10px]">Low Stock ({{ product.inventory?.stockQuantity }})</span>
                  <span *ngIf="product.inventory?.status === 'OUT_OF_STOCK'" class="badge badge-out-of-stock text-[10px]">Sold Out</span>
                </div>

                <a [routerLink]="['/product', product.slug]" class="font-bold text-lg text-white hover:text-indigo-400 transition-colors block">
                  {{ product.name }}
                </a>

                <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {{ product.description }}
                </p>

                <div class="flex items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Brand: <strong class="text-slate-200">{{ product.brand || 'Nexus' }}</strong></span>
                  <span>Warehouse: <strong class="text-slate-200">{{ product.inventory?.warehouseLocation || 'Main WH' }}</strong></span>
                </div>
              </div>

              <div class="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shrink-0 sm:border-l sm:border-slate-800 sm:pl-6">
                <div class="text-right">
                  <div class="text-2xl font-black text-white price-tag">
                    ₹{{ (product.discountPrice || product.price) | number:'1.2-2' }}
                  </div>
                  <div *ngIf="product.discountPrice" class="text-xs text-slate-500 line-through price-tag">
                    ₹{{ product.price | number:'1.2-2' }}
                  </div>
                </div>

                <a [routerLink]="['/product', product.slug]" class="btn btn-primary text-xs py-2 px-4 whitespace-nowrap">
                  View Specs →
                </a>
              </div>

            </div>
          </div>

          <!-- Pagination Controls -->
          <div *ngIf="totalPages() > 1" class="flex items-center justify-between pt-6 border-t border-slate-800">
            <button [disabled]="currentPage() === 0" (click)="goToPage(currentPage() - 1)" 
                    class="btn btn-secondary text-xs px-4 py-2">
              ← Previous
            </button>

            <div class="flex items-center gap-1.5">
              <span class="text-xs text-slate-400 font-mono">
                Page <strong class="text-white">{{ currentPage() + 1 }}</strong> of <strong class="text-white">{{ totalPages() }}</strong>
              </span>
            </div>

            <button [disabled]="currentPage() >= totalPages() - 1" (click)="goToPage(currentPage() + 1)" 
                    class="btn btn-secondary text-xs px-4 py-2">
              Next →
            </button>
          </div>

        </main>

      </div>

    </div>
  `
})
export class CatalogComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  loading = signal(true);

  viewMode: 'grid' | 'list' = 'grid';
  filterKeyword = '';
  selectedCategoryId: number | null = null;
  filterStatus: InventoryStatus | null = null;
  maxPriceLimit = 500000;
  featuredOnly = false;
  includeInactive = false;
  sortByOption = 'id_desc';

  constructor(
    private catalogService: CatalogService,
    private categoryService: CategoryService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getCategories(false).subscribe({
      next: (res) => {
        if (res.success) {
          this.categories.set(res.data);
        }
      }
    });
  }

  loadProducts() {
    this.loading.set(true);

    const [sortBy, sortDir] = this.sortByOption.split('_');

    const filter: ProductFilter = {
      page: this.currentPage(),
      size: 12,
      sortBy: sortBy,
      sortDir: sortDir as 'asc' | 'desc',
      keyword: this.filterKeyword.trim() || undefined,
      categoryId: this.selectedCategoryId !== null ? this.selectedCategoryId : undefined,
      maxPrice: this.maxPriceLimit < 5000 ? this.maxPriceLimit : undefined,
      inventoryStatus: this.filterStatus || undefined,
      featured: this.featuredOnly ? true : undefined,
      active: this.includeInactive ? undefined : true
    };

    this.catalogService.getProducts(filter).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products.set(res.data.content);
          this.totalElements.set(res.data.totalElements);
          this.totalPages.set(res.data.totalPages);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load products from backend API.');
      }
    });
  }

  applyFilters() {
    this.currentPage.set(0);
    this.loadProducts();
  }

  selectCategory(id: number | null) {
    this.selectedCategoryId = id;
    this.applyFilters();
  }

  setStockFilter(status: InventoryStatus | null) {
    this.filterStatus = status;
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  resetFilters() {
    this.filterKeyword = '';
    this.selectedCategoryId = null;
    this.filterStatus = null;
    this.maxPriceLimit = 5000;
    this.featuredOnly = false;
    this.includeInactive = false;
    this.sortByOption = 'id_desc';
    this.applyFilters();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  getStockPercentage(qty: number): number {
    if (!qty || qty <= 0) return 0;
    return Math.min(100, Math.round((qty / 80) * 100));
  }
}
