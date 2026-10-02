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
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs text-slate-400 mb-8 font-medium">
        <a routerLink="/catalog" class="hover:text-white transition-colors">Catalog</a>
        <span>/</span>
        <span class="text-indigo-400">{{ product()?.category?.name || 'Category' }}</span>
        <span>/</span>
        <span class="text-slate-200 truncate max-w-xs">{{ product()?.name }}</span>
      </nav>

      <!-- Loading State -->
      <div *ngIf="loading()" class="glass-panel p-12 text-center">
        <div class="inline-block w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
        <p class="text-sm text-slate-400">Loading product specifications and real-time inventory...</p>
      </div>

      <!-- Main Product Grid -->
      <div *ngIf="!loading() && product()" class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Left: Image Gallery & Badges -->
        <div class="lg:col-span-6 space-y-4">
          <div style="height: 420px; max-height: 420px;" class="glass-panel p-6 bg-slate-900/80 overflow-hidden relative flex items-center justify-center">
            <img [src]="product()?.imageUrl" [alt]="product()?.name" 
                 style="max-height: 360px; max-width: 90%; object-fit: contain;"
                 class="hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
            
            <div class="absolute top-4 left-4 flex flex-col gap-2">
              <span *ngIf="product()?.inventory?.status === 'IN_STOCK'" class="badge badge-in-stock">
                In Stock ({{ product()?.inventory?.stockQuantity }})
              </span>
              <span *ngIf="product()?.inventory?.status === 'LOW_STOCK'" class="badge badge-low-stock">
                Low Stock ({{ product()?.inventory?.stockQuantity }})
              </span>
              <span *ngIf="product()?.inventory?.status === 'OUT_OF_STOCK'" class="badge badge-out-of-stock">
                Sold Out
              </span>
            </div>

            <div *ngIf="product()?.featured" class="absolute top-4 right-4">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                ⭐ Featured Item
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Details & Real-time Stock Hub -->
        <div class="lg:col-span-6 space-y-6">
          
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-indigo-400">{{ product()?.brand || 'Premium Brand' }}</span>
              <span class="text-slate-700">•</span>
              <span class="sku-pill">SKU: {{ product()?.sku }}</span>
              <span class="text-slate-700">•</span>
              <span class="text-xs text-amber-400 font-semibold">★ {{ product()?.rating || '5.0' }} Rating</span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {{ product()?.name }}
            </h1>
          </div>

          <!-- Pricing Section -->
          <div class="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div class="text-xs text-slate-400 font-medium mb-1">Catalog Unit Price</div>
              <div class="flex items-baseline gap-3">
                <span class="text-3xl font-black text-white price-tag">
                  ₹{{ (product()?.discountPrice || product()?.price) | number:'1.2-2' }}
                </span>
                <span *ngIf="product()?.discountPrice" class="text-base text-slate-500 line-through price-tag">
                  ₹{{ product()?.price | number:'1.2-2' }}
                </span>
              </div>
            </div>

            <div *ngIf="product()?.discountPrice" class="text-right">
              <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Save ₹{{ ((product()?.price || 0) - (product()?.discountPrice || 0)) | number:'1.2-2' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Overview & Description</h3>
            <p class="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
              {{ product()?.description }}
            </p>
          </div>

          <!-- Real-Time Warehouse Inventory Tracker -->
          <div class="glass-panel p-5 space-y-4 border-indigo-500/20">
            <div class="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <svg width="16" height="16" class="text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Warehouse Inventory Health
              </h3>
              <span class="text-xs font-mono text-slate-400">
                WH: {{ product()?.inventory?.warehouseLocation || 'Silicon Bay (WH-A1)' }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-3 text-center">
              <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">Physical Stock</div>
                <div class="text-xl font-bold font-mono text-white mt-1">{{ product()?.inventory?.stockQuantity }}</div>
              </div>
              <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">Reserved Units</div>
                <div class="text-xl font-bold font-mono text-slate-400 mt-1">{{ product()?.inventory?.reservedQuantity }}</div>
              </div>
              <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <div class="text-[10px] uppercase font-bold text-slate-400">Available Qty</div>
                <div class="text-xl font-bold font-mono text-emerald-400 mt-1">{{ product()?.inventory?.availableQuantity }}</div>
              </div>
            </div>

            <!-- Manager Quick Stock Adjustment Action -->
            <div *ngIf="authService.isManager()" class="pt-2 flex items-center justify-between">
              <span class="text-xs text-slate-400">Quick stock management:</span>
              <button (click)="openAdjustModal()" class="btn btn-secondary text-xs py-1.5 px-3 border-indigo-500/30 text-indigo-300 hover:bg-indigo-950/50">
                ⚡ Adjust / Restock Stock
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center gap-4 pt-4">
            <a routerLink="/catalog" class="btn btn-secondary flex-1 py-3 text-xs sm:text-sm">
              ← Return to Catalog
            </a>
            <a *ngIf="authService.isManager()" routerLink="/admin" class="btn btn-primary flex-1 py-3 text-xs sm:text-sm">
              🛠️ Edit in Admin Studio
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
}
