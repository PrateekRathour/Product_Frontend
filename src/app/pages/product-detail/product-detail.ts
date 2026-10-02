import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../services/catalog.service';
import { InventoryService } from '../../services/inventory.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Product } from '../../models/catalog.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      <!-- Modern Breadcrumb & Back Navigation -->
      <div class="flex items-center justify-between gap-4 mb-8">
        <nav class="flex items-center gap-2 text-xs font-medium text-slate-400">
          <a routerLink="/catalog" class="hover:text-indigo-400 transition-colors flex items-center gap-1">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Catalog
          </a>
          <span class="text-slate-600">/</span>
          <span class="text-indigo-300 font-semibold">{{ product()?.category?.name || 'Category' }}</span>
          <span class="text-slate-600">/</span>
          <span class="text-slate-200 truncate max-w-[200px] sm:max-w-md">{{ product()?.name }}</span>
        </nav>

        <a routerLink="/catalog" class="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-sm">
          <span>← Back to Catalog</span>
        </a>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="glass-panel p-16 text-center space-y-4">
        <div class="inline-block w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-sm text-slate-400 font-mono">Synchronizing hardware specifications & inventory status...</p>
      </div>

      <!-- Main Product Grid -->
      <div *ngIf="!loading() && product()" class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <!-- Left Column: Studio Hardware Showcase & Quality Badges -->
        <div class="lg:col-span-6 space-y-6">
          
          <div class="detail-showcase-card p-8 flex items-center justify-center min-h-[440px]">
            <img [src]="product()?.imageUrl" [alt]="product()?.name" 
                 class="max-h-[360px] max-w-[90%] object-contain hover:scale-105 transition-transform duration-500 drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]" />
            
            <!-- Floating Status Badges (Top Left) -->
            <div class="absolute top-4 left-4 flex flex-col gap-2 z-10">
              <span *ngIf="product()?.inventory?.status === 'IN_STOCK'" class="badge-stock-pill badge-stock-in text-xs py-1 px-3">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                In Stock ({{ product()?.inventory?.stockQuantity }})
              </span>
              <span *ngIf="product()?.inventory?.status === 'LOW_STOCK'" class="badge-stock-pill badge-stock-low text-xs py-1 px-3 animate-pulse">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                Low Stock ({{ product()?.inventory?.stockQuantity }})
              </span>
              <span *ngIf="product()?.inventory?.status === 'OUT_OF_STOCK'" class="badge-stock-pill badge-stock-out text-xs py-1 px-3">
                <span class="w-2 h-2 rounded-full bg-rose-400"></span>
                Sold Out
              </span>
            </div>

            <!-- Featured Badge (Top Right) -->
            <div *ngIf="product()?.featured" class="absolute top-4 right-4 z-10">
              <span class="badge-featured-pill text-xs py-1 px-3">
                ⭐ Featured Flagship
              </span>
            </div>

            <!-- Brand Watermark (Bottom Right) -->
            <div *ngIf="product()?.brand" class="absolute bottom-4 right-4 z-10 text-xs font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg backdrop-blur-md border border-slate-700/60">
              {{ product()?.brand }}
            </div>
          </div>

          <!-- Enterprise Trust / Assurance Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <div class="feature-bullet-pill">
              <span class="text-base">🛡️</span>
              <div>
                <strong>2-Year Warranty</strong>
                <div class="text-[10px] text-slate-400">Official OEM Coverage</div>
              </div>
            </div>

            <div class="feature-bullet-pill">
              <span class="text-base">⚡</span>
              <div>
                <strong>Express Dispatch</strong>
                <div class="text-[10px] text-slate-400">Same-Day Priority Pack</div>
              </div>
            </div>

            <div class="feature-bullet-pill">
              <span class="text-base">🧾</span>
              <div>
                <strong>GST Invoicing</strong>
                <div class="text-[10px] text-slate-400">100% Tax Compliant</div>
              </div>
            </div>

            <div class="feature-bullet-pill">
              <span class="text-base">🔒</span>
              <div>
                <strong>Tamper-Proof Seal</strong>
                <div class="text-[10px] text-slate-400">Factory Sealed Box</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Product Overview, Specs, Real-Time Inventory Hub & Actions -->
        <div class="lg:col-span-6 space-y-6">
          
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-2.5">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono">
                {{ product()?.brand || 'Nexus Pro' }}
              </span>
              <span class="sku-pill">SKU: {{ product()?.sku }}</span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                ★ {{ product()?.rating || '5.0' }} (Enterprise Verified)
              </span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {{ product()?.name }}
            </h1>
          </div>

          <!-- Hero Price Box -->
          <div class="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
            <div>
              <div class="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <span>Enterprise Catalog Price</span>
                <span class="text-[10px] text-slate-500">(Inclusive of GST)</span>
              </div>
              <div class="flex flex-wrap items-baseline gap-3">
                <span class="text-3xl sm:text-4xl font-black text-white price-tag">
                  ₹{{ (product()?.discountPrice || product()?.price) | number:'1.2-2' }}
                </span>
                <span *ngIf="product()?.discountPrice" class="text-lg text-slate-500 line-through price-tag">
                  ₹{{ product()?.price | number:'1.2-2' }}
                </span>
              </div>
            </div>

            <div *ngIf="product()?.discountPrice" class="text-right">
              <span class="discount-chip text-xs py-1 px-2.5 mb-1 inline-block">
                {{ getDiscountPercent(product()?.price || 0, product()?.discountPrice) }}% DISCOUNT
              </span>
              <div class="text-xs text-emerald-400 font-semibold font-mono">
                Save ₹{{ ((product()?.price || 0) - (product()?.discountPrice || 0)) | number:'1.2-2' }}
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
              <svg width="14" height="14" class="text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Executive Summary & Overview
            </h3>
            <p class="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
              {{ product()?.description }}
            </p>
          </div>

          <!-- Technical Specifications Matrix -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
              <svg width="14" height="14" class="text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/>
              </svg>
              Hardware & Inventory Specifications
            </h3>

            <div class="grid grid-cols-2 gap-2.5">
              <div class="spec-grid-item">
                <div class="text-[10px] text-slate-400 font-mono uppercase">Category Classification</div>
                <div class="text-xs font-bold text-white mt-0.5">{{ product()?.category?.name || 'Hardware' }}</div>
              </div>

              <div class="spec-grid-item">
                <div class="text-[10px] text-slate-400 font-mono uppercase">Catalog SKU Code</div>
                <div class="text-xs font-bold text-indigo-300 font-mono mt-0.5">{{ product()?.sku }}</div>
              </div>

              <div class="spec-grid-item">
                <div class="text-[10px] text-slate-400 font-mono uppercase">Warehouse Allocation</div>
                <div class="text-xs font-bold text-white mt-0.5">{{ product()?.inventory?.warehouseLocation || 'Silicon Bay (WH-A1)' }}</div>
              </div>

              <div class="spec-grid-item">
                <div class="text-[10px] text-slate-400 font-mono uppercase">Low Stock Threshold</div>
                <div class="text-xs font-bold text-amber-300 font-mono mt-0.5">{{ product()?.inventory?.lowStockThreshold || 5 }} units</div>
              </div>
            </div>
          </div>

          <!-- Real-Time Warehouse Inventory Health Tracker -->
          <div class="glass-panel p-5 space-y-4 border-indigo-500/25">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <svg width="16" height="16" class="text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Real-Time Stock Health & Allocation
              </h3>
              <span class="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Synced
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">Physical Stock</div>
                <div class="text-2xl font-bold font-mono text-white mt-1">{{ product()?.inventory?.stockQuantity }}</div>
              </div>
              <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">Reserved Units</div>
                <div class="text-2xl font-bold font-mono text-slate-400 mt-1">{{ product()?.inventory?.reservedQuantity }}</div>
              </div>
              <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">Available Qty</div>
                <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">{{ product()?.inventory?.availableQuantity }}</div>
              </div>
            </div>

            <!-- Stock Health Progress Bar -->
            <div class="space-y-1 pt-1">
              <div class="flex justify-between text-[11px] text-slate-400">
                <span>Warehouse Capacity Fill:</span>
                <span class="font-mono text-slate-200">{{ getStockPercentage(product()?.inventory?.stockQuantity || 0) }}%</span>
              </div>
              <div class="stock-gauge-bar">
                <div class="stock-gauge-fill"
                     [style.width.%]="getStockPercentage(product()?.inventory?.stockQuantity || 0)"
                     [ngClass]="{
                       'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]': product()?.inventory?.status === 'IN_STOCK',
                       'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]': product()?.inventory?.status === 'LOW_STOCK',
                       'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]': product()?.inventory?.status === 'OUT_OF_STOCK'
                     }">
                </div>
              </div>
            </div>

            <!-- Manager Quick Stock Adjustment Action -->
            <div *ngIf="authService.isManager()" class="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span class="text-xs text-slate-400">Manager stock override:</span>
              <button (click)="openAdjustModal()" class="btn btn-secondary text-xs py-1.5 px-3 border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/60 flex items-center gap-1.5 shadow-sm">
                <span>⚡ Adjust / Restock SKU</span>
              </button>
            </div>
          </div>

          <!-- Action Hub -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <a routerLink="/catalog" class="btn btn-secondary flex-1 py-3 text-xs sm:text-sm text-center">
              ← Return to Catalog
            </a>
            <a *ngIf="authService.isManager()" routerLink="/admin" class="btn btn-primary flex-1 py-3 text-xs sm:text-sm text-center">
              🛠️ Manage in Studio
            </a>
          </div>

        </div>

      </div>

      <!-- Quick Adjust Modal -->
      <div *ngIf="showAdjustModal" class="modal-backdrop" (click)="closeOnBackdrop($event)">
        <div class="modal-container p-6 animate-fade-in" style="max-width: 440px;">
          <div class="flex justify-between items-center pb-4 border-b border-slate-800">
            <h3 class="font-bold text-white text-base">Adjust Stock: {{ product()?.name }}</h3>
            <button (click)="showAdjustModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form (ngSubmit)="submitAdjust()" class="space-y-4 mt-4">
            <div>
              <label class="label-control">Change Quantity (+ to add, - to subtract)</label>
              <input type="number" [(ngModel)]="adjustChangeQty" name="changeQty" required class="input-control" placeholder="e.g. 10 or -5">
              <p class="text-[11px] text-slate-400 mt-1">
                Current: {{ product()?.inventory?.stockQuantity }} → New: {{ (product()?.inventory?.stockQuantity || 0) + adjustChangeQty }}
              </p>
            </div>

            <div>
              <label class="label-control">Reason for Adjustment</label>
              <input type="text" [(ngModel)]="adjustReason" name="reason" required class="input-control" placeholder="e.g. Shipment received, cycle count adjustment">
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" (click)="showAdjustModal = false" class="btn btn-secondary text-xs">Cancel</button>
              <button type="submit" [disabled]="adjustLoading" class="btn btn-primary text-xs">Save Adjustment</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);

  showAdjustModal = false;
  adjustChangeQty = 10;
  adjustReason = 'Batch intake shipment';
  adjustLoading = false;

  constructor(
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private inventoryService: InventoryService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProductBySlug(slug);
      }
    });
  }

  loadProductBySlug(slug: string) {
    this.loading.set(true);
    this.catalogService.getProductBySlug(slug).subscribe({
      next: (res) => {
        if (res.success) {
          this.product.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Product not found in catalog.');
      }
    });
  }

  openAdjustModal() {
    this.adjustChangeQty = 10;
    this.adjustReason = 'Stock adjustment by manager';
    this.showAdjustModal = true;
  }

  submitAdjust() {
    const p = this.product();
    if (!p) return;

    this.adjustLoading = true;
    this.inventoryService.adjustStock(p.id, {
      changeQuantity: this.adjustChangeQty,
      reason: this.adjustReason
    }).subscribe({
      next: () => {
        this.toastService.success('Stock adjusted successfully!');
        this.showAdjustModal = false;
        this.adjustLoading = false;
        this.loadProductBySlug(p.slug);
      },
      error: (err) => {
        this.adjustLoading = false;
        const msg = err.error?.message || 'Failed to adjust stock.';
        this.toastService.error(msg);
      }
    });
  }

  closeOnBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAdjustModal = false;
    }
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
