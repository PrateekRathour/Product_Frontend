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
      
      <!-- Step 2: Hero Showcase Section -->
      <div class="relative overflow-hidden rounded-3xl hero-banner p-6 sm:p-10 lg:p-12 mb-8 shadow-2xl">
        <!-- Ambient Decorative Glows -->
        <div class="hero-glow hero-glow-indigo"></div>
        <div class="hero-glow hero-glow-emerald"></div>
        <div class="hero-glow hero-glow-purple"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-5">
            <!-- Live Status & Metric Pills -->
            <div class="flex flex-wrap items-center gap-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>⚡ Live Catalog Engine</span>
              </div>
              <div class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 text-xs font-mono">
                <span class="text-emerald-400 font-bold">●</span>
                <span>All Systems Operational</span>
              </div>
              <div class="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 text-indigo-300 border border-slate-700/60 text-xs font-mono">
                <span>₹ INR Storefront</span>
              </div>
            </div>

            <!-- Hero Headline -->
            <div>
              <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Next-Gen Flagship <span class="gradient-primary">Devices & Hardware</span>
              </h1>
              <p class="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed max-w-2xl">
                Explore curated high-performance smartphones, premium audio, and enterprise hardware with real-time stock recalculation and instant SKU lookup.
              </p>
            </div>

            <!-- Interactive Search Dock -->
            <div class="search-dock-container">
              <div class="search-dock flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2">
                <div class="relative flex-1 flex items-center">
                  <svg width="20" height="20" class="text-indigo-400 ml-3 mr-2 shrink-0 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input type="text" [(ngModel)]="filterKeyword" (keyup.enter)="applyFilters()" 
                         placeholder="Search by title, SKU, chipset, brand, or specs..."
                         class="search-dock-input w-full py-2.5 pr-8 text-sm sm:text-base" />
                  <button *ngIf="filterKeyword" (click)="filterKeyword = ''; applyFilters()" 
                          class="absolute right-3 text-slate-400 hover:text-white transition-colors text-sm px-1.5 py-0.5 rounded bg-slate-800/60"
                          title="Clear search">
                    ✕
                  </button>
                </div>

                <div class="flex items-center gap-2 px-1">
                  <button (click)="applyFilters()" class="btn btn-primary px-6 py-2.5 text-sm font-bold shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 whitespace-nowrap">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <span>Search Catalog</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Trending Search Tags -->
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-400 pt-1">
              <span class="font-medium text-slate-400 flex items-center gap-1">
                <svg width="12" height="12" class="text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.17 2.13-1.604 3.784-.438 1.66-.52 3.23-.23 4.417.06.248.15.485.27.707-.463-.09-.948-.285-1.43-.59-.81-.51-1.53-1.25-1.95-2.09a1 1 0 00-1.78.9c.7 1.39 1.8 2.56 3.09 3.32 1.34.8 2.87 1.15 4.35.89 1.48-.25 2.8-1.07 3.65-2.22.85-1.16 1.14-2.6.76-4.01-.39-1.44-1.39-2.71-2.49-3.79-.62-.61-1.27-1.22-1.81-1.98z" clip-rule="evenodd"/>
                </svg>
                Popular:
              </span>
              <button *ngFor="let tag of ['iPhone 16 Pro', 'Galaxy S24', 'MacBook Pro', 'Sony WH-1000XM5']" 
                      (click)="quickSearch(tag)"
                      class="px-2.5 py-0.5 rounded-full bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/50 transition-all font-mono text-[11px]">
                {{ tag }}
              </button>
              <button *ngIf="filterKeyword" (click)="resetFilters()" class="text-indigo-400 hover:text-indigo-300 underline font-semibold text-[11px] ml-1">
                Clear Search
              </button>
            </div>

          </div>

          <!-- Hero Metrics Cards (Clean Right Column) -->
          <div class="hidden lg:flex lg:col-span-4 flex-col gap-4">
            <div class="hero-metric-card">
              <div class="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>TOTAL CATALOG</span>
                <span class="text-emerald-400 font-bold">● ACTIVE</span>
              </div>
              <div class="text-3xl font-black text-white font-mono">{{ totalElements() }} <span class="text-sm font-normal text-slate-400">SKUs</span></div>
              <div class="text-[11px] text-slate-400 mt-1">Synchronized across 6 categories</div>
            </div>

            <div class="hero-metric-card">
              <div class="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
                <span>STOCK ACCURACY</span>
                <span class="text-indigo-400 font-bold">REAL-TIME</span>
              </div>
              <div class="text-3xl font-black text-white font-mono">100% <span class="text-sm font-normal text-emerald-400">Verified</span></div>
              <div class="text-[11px] text-slate-400 mt-1">Automated threshold recalculation</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Step 2: Quick Category Pills Bar -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <svg width="14" height="14" class="text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
            Categories & Collections
          </h2>
          <span class="text-xs text-slate-400">{{ categories().length }} categories available</span>
        </div>

        <div class="category-pills-slider flex items-center gap-2.5 overflow-x-auto pb-2">
          <button (click)="selectCategory(null)"
                  [ngClass]="selectedCategoryId === null ? 'active-category-pill' : 'inactive-category-pill'"
                  class="category-pill">
            <span class="category-pill-icon">🌐</span>
            <span class="category-pill-name">All Products</span>
            <span class="category-pill-count">{{ totalElements() }}</span>
          </button>
          
          <button *ngFor="let cat of categories()" (click)="selectCategory(cat.id)"
                  [ngClass]="selectedCategoryId === cat.id ? 'active-category-pill' : 'inactive-category-pill'"
                  class="category-pill">
            <span class="category-pill-icon">{{ getCategoryIcon(cat.name) }}</span>
            <span class="category-pill-name">{{ cat.name }}</span>
            <span class="category-pill-count">{{ cat.productCount || 0 }}</span>
          </button>
        </div>
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
                 class="product-card-pro group">
              
              <!-- Product Image Box -->
              <div class="product-img-box-pro">
                <img [src]="product.imageUrl" [alt]="product.name" />
                
                <!-- Status Badges Overlay (Top-Left) -->
                <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                  <span *ngIf="product.inventory?.status === 'IN_STOCK'" class="badge-stock-pill badge-stock-in">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    In Stock ({{ product.inventory?.stockQuantity }})
                  </span>
                  <span *ngIf="product.inventory?.status === 'LOW_STOCK'" class="badge-stock-pill badge-stock-low animate-pulse">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Low Stock ({{ product.inventory?.stockQuantity }})
                  </span>
                  <span *ngIf="product.inventory?.status === 'OUT_OF_STOCK'" class="badge-stock-pill badge-stock-out">
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Sold Out
                  </span>
                </div>

                <!-- Featured Pill (Top-Right) -->
                <div *ngIf="product.featured" class="absolute top-3 right-3 z-10">
                  <span class="badge-featured-pill">
                    ⭐ Featured
                  </span>
                </div>

                <!-- Discount Chip (Bottom-Left) -->
                <div *ngIf="product.discountPrice" class="absolute bottom-3 left-3 z-10">
                  <span class="discount-chip">
                    {{ getDiscountPercent(product.price, product.discountPrice) }}% OFF
                  </span>
                </div>

                <!-- Brand Watermark (Bottom-Right) -->
                <div *ngIf="product.brand" class="absolute bottom-3 right-3 z-10 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500/80 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm border border-slate-700/40">
                  {{ product.brand }}
                </div>
              </div>

              <!-- Product Info & Actions -->
              <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div class="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span class="font-semibold text-indigo-400 tracking-wide hover:underline cursor-pointer" (click)="selectCategory(product.category.id)">{{ product.category.name }}</span>
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

                <!-- Stock Gauge & Warehouse -->
                <div *ngIf="product.inventory" class="space-y-1.5 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                  <div class="flex justify-between text-[10px] text-slate-400">
                    <span class="flex items-center gap-1">
                      <svg width="10" height="10" class="text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                      </svg>
                      {{ product.inventory.warehouseLocation || 'Primary Warehouse' }}
                    </span>
                    <span class="font-mono font-semibold" 
                          [ngClass]="{
                            'text-emerald-400': product.inventory.status === 'IN_STOCK',
                            'text-amber-400': product.inventory.status === 'LOW_STOCK',
                            'text-rose-400': product.inventory.status === 'OUT_OF_STOCK'
                          }">
                      {{ product.inventory.stockQuantity }} left
                    </span>
                  </div>
                  <div class="stock-gauge-bar">
                    <div class="stock-gauge-fill"
                         [style.width.%]="getStockPercentage(product.inventory.stockQuantity)"
                         [ngClass]="{
                           'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]': product.inventory.status === 'IN_STOCK',
                           'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]': product.inventory.status === 'LOW_STOCK',
                           'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]': product.inventory.status === 'OUT_OF_STOCK'
                         }">
                    </div>
                  </div>
                </div>

                <!-- Price & Action Button -->
                <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex flex-wrap items-baseline gap-1.5">
                      <span class="text-lg font-extrabold text-white price-tag">
                        ₹{{ (product.discountPrice || product.price) | number:'1.2-2' }}
                      </span>
                      <span *ngIf="product.discountPrice" class="text-xs text-slate-500 line-through price-tag">
                        ₹{{ product.price | number:'1.2-2' }}
                      </span>
                    </div>
                    <span *ngIf="product.discountPrice" class="text-[10px] text-emerald-400 font-semibold block">
                      Save ₹{{ (product.price - product.discountPrice) | number:'1.2-2' }}
                    </span>
                  </div>

                  <a [routerLink]="['/product', product.slug]" 
                     class="btn btn-primary text-xs py-2 px-3 shadow-md shadow-indigo-600/20 hover:scale-105 transition-all shrink-0">
                    <span>Specs</span>
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>

              </div>

            </div>

          </div>

          <!-- List View of Products -->
          <div *ngIf="!loading() && viewMode === 'list' && products().length > 0" class="space-y-4">
            <div *ngFor="let product of products()" 
                 class="product-list-card-pro group flex flex-col md:flex-row md:items-center justify-between gap-5 p-4 sm:p-5">
              
              <!-- Thumbnail + Metadata -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                <div class="product-list-thumb shrink-0">
                  <img [src]="product.imageUrl" [alt]="product.name" />
                </div>

                <div class="space-y-1.5 min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-semibold text-indigo-400">{{ product.category.name }}</span>
                    <span class="text-slate-600">•</span>
                    <span class="sku-pill">{{ product.sku }}</span>
                    <span *ngIf="product.brand" class="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">{{ product.brand }}</span>
                    <span *ngIf="product.inventory?.status === 'IN_STOCK'" class="badge-stock-pill badge-stock-in text-[10px]">In Stock ({{ product.inventory?.stockQuantity }})</span>
                    <span *ngIf="product.inventory?.status === 'LOW_STOCK'" class="badge-stock-pill badge-stock-low text-[10px] animate-pulse">Low Stock ({{ product.inventory?.stockQuantity }})</span>
                    <span *ngIf="product.inventory?.status === 'OUT_OF_STOCK'" class="badge-stock-pill badge-stock-out text-[10px]">Sold Out</span>
                    <span *ngIf="product.featured" class="badge-featured-pill text-[10px]">⭐ Featured</span>
                  </div>

                  <a [routerLink]="['/product', product.slug]" class="font-bold text-base sm:text-lg text-white hover:text-indigo-400 transition-colors block truncate">
                    {{ product.name }}
                  </a>

                  <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {{ product.description }}
                  </p>

                  <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span>Warehouse: <strong class="text-slate-200">{{ product.inventory?.warehouseLocation || 'Main Hub' }}</strong></span>
                    <span class="text-slate-600">•</span>
                    <span>Min Alert: <strong class="text-slate-200">{{ product.inventory?.lowStockThreshold || 5 }} units</strong></span>
                  </div>
                </div>
              </div>

              <!-- Price & CTA Column -->
              <div class="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 md:border-l md:border-slate-800/80 md:pl-6 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                <div class="text-left md:text-right">
                  <div class="text-2xl font-black text-white price-tag">
                    ₹{{ (product.discountPrice || product.price) | number:'1.2-2' }}
                  </div>
                  <div *ngIf="product.discountPrice" class="flex items-center md:justify-end gap-1.5 mt-0.5">
                    <span class="text-xs text-slate-500 line-through price-tag">
                      ₹{{ product.price | number:'1.2-2' }}
                    </span>
                    <span class="discount-chip text-[10px]">
                      {{ getDiscountPercent(product.price, product.discountPrice) }}% OFF
                    </span>
                  </div>
                </div>

                <a [routerLink]="['/product', product.slug]" class="btn btn-primary text-xs py-2 px-4 shadow-md shadow-indigo-600/20 whitespace-nowrap flex items-center gap-1.5">
                  <span>View Details</span>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
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
      maxPrice: this.maxPriceLimit < 500000 ? this.maxPriceLimit : undefined,
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

  quickSearch(term: string) {
    this.filterKeyword = term;
    this.applyFilters();
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
    this.maxPriceLimit = 500000;
    this.featuredOnly = false;
    this.includeInactive = false;
    this.sortByOption = 'id_desc';
    this.applyFilters();
  }

  getCategoryIcon(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('smartphone') || n.includes('mobile') || n.includes('phone')) return '📱';
    if (n.includes('laptop') || n.includes('computer') || n.includes('macbook')) return '💻';
    if (n.includes('audio') || n.includes('headphone') || n.includes('earbud')) return '🎧';
    if (n.includes('tablet') || n.includes('ipad')) return '📟';
    if (n.includes('wearable') || n.includes('watch')) return '⌚';
    if (n.includes('camera')) return '📷';
    if (n.includes('gaming') || n.includes('console')) return '🎮';
    if (n.includes('accessory') || n.includes('cable') || n.includes('charger')) return '🔌';
    return '📦';
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  getStockPercentage(qty: number): number {
    if (!qty || qty <= 0) return 0;
    return Math.min(100, Math.round((qty / 80) * 100));
  }

  getDiscountPercent(price: number, discountPrice?: number): number {
    if (!discountPrice || discountPrice >= price || price <= 0) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  }
}
