import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Inventory, InventoryAuditLog, InventoryStatus } from '../../models/catalog.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-8">
      
      <!-- Top Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-semibold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Warehouse & Logistics Engine
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Real-Time Inventory Hub</h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1">
            Monitor real-time warehouse quantities, reorder thresholds, and execute auditable multi-tier stock adjustments.
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button (click)="openAuditModal(null)" class="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm">
            <span>📜 Global Audit Trail</span>
          </button>
          <button (click)="loadInventories()" class="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-md shadow-indigo-600/30">
            <span>🔄 Refresh Stock</span>
          </button>
        </div>
      </div>

      <!-- Inventory KPI Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Total Tracked SKUs -->
        <div class="glass-card p-5 border-indigo-500/30 relative overflow-hidden space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-indigo-400 font-mono uppercase">
            <span>Total Tracked SKUs</span>
            <span>📦</span>
          </div>
          <div class="text-3xl font-black font-mono text-white">{{ inventories().length }} <span class="text-xs font-normal text-slate-400">Products</span></div>
          <div class="text-[11px] text-slate-400">All active catalog entities</div>
          <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <!-- In Stock Healthy -->
        <div class="glass-card p-5 border-emerald-500/30 relative overflow-hidden space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-emerald-400 font-mono uppercase">
            <span>Healthy Stock</span>
            <span>✅</span>
          </div>
          <div class="text-3xl font-black font-mono text-emerald-400">{{ inStockCount() }} <span class="text-xs font-normal text-slate-400">Optimal</span></div>
          <div class="text-[11px] text-slate-400">Above reorder safety thresholds</div>
          <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="glass-card p-5 border-amber-500/30 relative overflow-hidden space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-amber-400 font-mono uppercase">
            <span>Low Stock Alerts</span>
            <span>⚠️</span>
          </div>
          <div class="text-3xl font-black font-mono text-amber-400">{{ lowStockCount() }} <span class="text-xs font-normal text-slate-400">Attention</span></div>
          <div class="text-[11px] text-slate-400">Below minimum safety levels</div>
          <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

        <!-- Out of Stock -->
        <div class="glass-card p-5 border-rose-500/30 relative overflow-hidden space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-rose-400 font-mono uppercase">
            <span>Depleted Stock</span>
            <span>🛑</span>
          </div>
          <div class="text-3xl font-black font-mono text-rose-400">{{ outOfStockCount() }} <span class="text-xs font-normal text-slate-400">Depleted</span></div>
          <div class="text-[11px] text-slate-400">Immediate replenishment required</div>
          <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>
        </div>

      </div>

      <!-- Low Stock Emergency Banner -->
      <div *ngIf="lowStockCount() > 0" class="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-amber-900/30 to-amber-950/60 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/40">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/40 text-lg">
            ⚠️
          </div>
          <div>
            <h4 class="text-sm font-bold text-amber-100">Attention Required: {{ lowStockCount() }} Items Below Safety Threshold</h4>
            <p class="text-xs text-amber-200/80">Stock levels have fallen below safety reorder threshold or are completely depleted.</p>
          </div>
        </div>
        <button (click)="filterStatus = 'LOW_STOCK'" class="btn btn-secondary text-xs py-2 px-4 border-amber-500/40 text-amber-200 hover:bg-amber-900/60 whitespace-nowrap">
          View Critical SKUs →
        </button>
      </div>

      <!-- Filters & Quick Search Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
        <div class="flex flex-wrap items-center gap-2">
          <button (click)="filterStatus = null" 
                  [ngClass]="filterStatus === null ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            🌐 All SKUs ({{ inventories().length }})
          </button>
          <button (click)="filterStatus = 'LOW_STOCK'" 
                  [ngClass]="filterStatus === 'LOW_STOCK' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            ⚠️ Low Stock ({{ lowStockCount() }})
          </button>
          <button (click)="filterStatus = 'OUT_OF_STOCK'" 
                  [ngClass]="filterStatus === 'OUT_OF_STOCK' ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            🛑 Depleted ({{ outOfStockCount() }})
          </button>
          <button (click)="filterStatus = 'IN_STOCK'" 
                  [ngClass]="filterStatus === 'IN_STOCK' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            ✅ In Stock ({{ inStockCount() }})
          </button>
        </div>

        <div class="w-full sm:w-72 relative">
          <input type="text" [(ngModel)]="searchKeyword" placeholder="Filter by SKU or warehouse location..." 
                 class="input-control text-xs py-2 pl-8 bg-slate-950/80 border-slate-700 w-full">
          <svg width="14" height="14" class="text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <!-- Upgraded Inventory Table -->
      <div class="table-container glass-panel">
        <table class="custom-table">
          <thead>
            <tr>
              <th>SKU / Identifier</th>
              <th>Status</th>
              <th>Physical Stock</th>
              <th>Reserved Units</th>
              <th>Available Qty</th>
              <th>Capacity Gauge</th>
              <th>Reorder Limit</th>
              <th>Warehouse Hub</th>
              <th class="text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredInventories()">
              <td>
                <span class="sku-pill font-mono font-bold">{{ item.sku }}</span>
              </td>
              <td>
                <span *ngIf="item.status === 'IN_STOCK'" class="badge-stock-pill badge-stock-in text-[10px]">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> In Stock
                </span>
                <span *ngIf="item.status === 'LOW_STOCK'" class="badge-stock-pill badge-stock-low text-[10px] animate-pulse">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Low Stock
                </span>
                <span *ngIf="item.status === 'OUT_OF_STOCK'" class="badge-stock-pill badge-stock-out text-[10px]">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span> Depleted
                </span>
              </td>
              <td>
                <span class="font-mono font-black text-white text-base">{{ item.stockQuantity }}</span>
              </td>
              <td>
                <span class="font-mono text-slate-400">{{ item.reservedQuantity }}</span>
              </td>
              <td>
                <span class="font-mono font-bold text-emerald-400 text-sm">{{ item.availableQuantity }}</span>
              </td>
              <td style="min-width: 130px;">
                <div class="space-y-1">
                  <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Fill:</span>
                    <span>{{ getStockPercentage(item.stockQuantity) }}%</span>
                  </div>
                  <div class="stock-gauge-bar">
                    <div class="stock-gauge-fill"
                         [style.width.%]="getStockPercentage(item.stockQuantity)"
                         [ngClass]="{
                           'bg-emerald-500': item.status === 'IN_STOCK',
                           'bg-amber-500': item.status === 'LOW_STOCK',
                           'bg-rose-500': item.status === 'OUT_OF_STOCK'
                         }">
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span class="font-mono text-amber-300 text-xs">{{ item.lowStockThreshold }} units</span>
              </td>
              <td>
                <span class="text-xs text-slate-300 font-medium">{{ item.warehouseLocation }}</span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button (click)="quickRestock(item, 10)" title="Add +10 units" 
                          class="px-2.5 py-1 rounded bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all shadow-sm">
                    +10
                  </button>
                  <button (click)="openAdjustModal(item)" title="Custom adjustment"
                          class="px-2.5 py-1 rounded bg-indigo-950/70 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-all shadow-sm">
                    ⚡ Adjust
                  </button>
                  <button (click)="openAuditModal(item.id)" title="View Audit Logs"
                          class="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700/60">
                    📜
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Custom Adjust Modal -->
      <div *ngIf="showAdjustModal" class="modal-backdrop" (click)="closeOnBackdrop($event)">
        <div class="modal-container p-6 animate-fade-in" style="max-width: 460px;">
          <div class="flex justify-between items-center pb-4 border-b border-slate-800">
            <h3 class="font-bold text-white text-base">Adjust Stock: {{ selectedItem?.sku }}</h3>
            <button (click)="showAdjustModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <form (ngSubmit)="submitAdjust()" class="space-y-4 mt-4">
            <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between text-xs">
              <span class="text-slate-400">Current Balance:</span>
              <span class="font-mono font-bold text-white">{{ selectedItem?.stockQuantity }} units</span>
            </div>

            <div>
              <label class="label-control">Quantity Delta (+ intake / - dispatch)</label>
              <input type="number" [(ngModel)]="adjustChangeQty" name="changeQty" required class="input-control" placeholder="e.g. 20 or -5">
              <p class="text-[11px] text-slate-400 mt-1 font-mono">
                Projected Balance: {{ (selectedItem?.stockQuantity || 0) + adjustChangeQty }} units
              </p>
            </div>

            <div>
              <label class="label-control">Low Stock Threshold</label>
              <input type="number" [(ngModel)]="adjustThreshold" name="threshold" class="input-control" placeholder="Default: 10">
            </div>

            <div>
              <label class="label-control">Reason for Stock Modification</label>
              <input type="text" [(ngModel)]="adjustReason" name="reason" required class="input-control" placeholder="e.g. Supplier bulk shipment, physical cycle count">
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button type="button" (click)="showAdjustModal = false" class="btn btn-secondary text-xs">Cancel</button>
              <button type="submit" [disabled]="modalLoading" class="btn btn-primary text-xs">
                Commit Stock Update
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Audit Trail Modal -->
      <div *ngIf="showAuditModal" class="modal-backdrop" (click)="closeOnBackdrop($event)">
        <div class="modal-container p-6 animate-fade-in" style="max-width: 650px;">
          <div class="flex justify-between items-center pb-4 border-b border-slate-800">
            <div>
              <h3 class="font-bold text-white text-base">Inventory Audit Logs</h3>
              <p class="text-xs text-slate-400 mt-0.5">Immutable record of all warehouse transactions and adjustments</p>
            </div>
            <button (click)="showAuditModal = false" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <div class="mt-4 max-h-[400px] overflow-y-auto space-y-3">
            <div *ngFor="let log of auditLogs()" class="p-3.5 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">{{ log.productName }} (<span class="text-indigo-400 font-mono">{{ log.sku }}</span>)</span>
                <span class="text-[11px] font-mono" [ngClass]="log.changeQuantity > 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'">
                  {{ log.changeQuantity > 0 ? '+' : '' }}{{ log.changeQuantity }} units
                </span>
              </div>
              <div class="flex items-center justify-between text-slate-400 text-[11px]">
                <span>{{ log.reason }}</span>
                <span>Balance: {{ log.previousQuantity }} → <strong class="text-slate-200">{{ log.newQuantity }}</strong></span>
              </div>
              <div class="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>By: {{ log.performedBy }}</span>
                <span>{{ log.timestamp | date:'short' }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800 flex justify-end">
            <button (click)="showAuditModal = false" class="btn btn-secondary text-xs">Close Audit</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class InventoryDashboardComponent implements OnInit {
  inventories = signal<Inventory[]>([]);
  auditLogs = signal<InventoryAuditLog[]>([]);
  lowStockCount = signal(0);
  inStockCount = signal(0);
  outOfStockCount = signal(0);
  loading = signal(true);

  filterStatus: InventoryStatus | null = null;
  searchKeyword = '';

  showAdjustModal = false;
  selectedItem: Inventory | null = null;
  adjustChangeQty = 10;
  adjustThreshold = 10;
  adjustReason = 'Warehouse intake batch';
  modalLoading = false;

  showAuditModal = false;

  constructor(
    private inventoryService: InventoryService,
    public authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadInventories();
  }

  loadInventories() {
    this.loading.set(true);
    this.inventoryService.getAllInventory().subscribe({
      next: (res) => {
        if (res.success) {
          this.inventories.set(res.data);
          const low = res.data.filter(i => i.status === 'LOW_STOCK').length;
          const out = res.data.filter(i => i.status === 'OUT_OF_STOCK').length;
          const inStock = res.data.filter(i => i.status === 'IN_STOCK').length;
          this.lowStockCount.set(low);
          this.outOfStockCount.set(out);
          this.inStockCount.set(inStock);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load inventories.');
      }
    });
  }

  getStockPercentage(qty: number): number {
    return Math.min(100, Math.round((qty / 80) * 100));
  }

  filteredInventories(): Inventory[] {
    return this.inventories().filter(i => {
      const matchesStatus = !this.filterStatus || i.status === this.filterStatus;
      const matchesSearch = !this.searchKeyword || 
        i.sku.toLowerCase().includes(this.searchKeyword.toLowerCase()) || 
        i.warehouseLocation.toLowerCase().includes(this.searchKeyword.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  quickRestock(item: Inventory, amount: number) {
    this.inventoryService.adjustStock(item.id, {
      changeQuantity: amount,
      reason: 'Quick Restock +10 from Inventory Hub'
    }).subscribe({
      next: () => {
        this.toastService.success(`Restocked +${amount} units for SKU ${item.sku}`);
        this.loadInventories();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to restock.';
        this.toastService.error(msg);
      }
    });
  }

  openAdjustModal(item: Inventory) {
    this.selectedItem = item;
    this.adjustChangeQty = 10;
    this.adjustThreshold = item.lowStockThreshold || 10;
    this.adjustReason = 'Stock adjustment by manager';
    this.showAdjustModal = true;
  }

  submitAdjust() {
    if (!this.selectedItem) return;

    this.modalLoading = true;
    this.inventoryService.adjustStock(this.selectedItem.id, {
      changeQuantity: this.adjustChangeQty,
      newThreshold: this.adjustThreshold,
      reason: this.adjustReason
    }).subscribe({
      next: () => {
        this.toastService.success(`Stock updated for ${this.selectedItem?.sku}`);
        this.showAdjustModal = false;
        this.modalLoading = false;
        this.loadInventories();
      },
      error: (err) => {
        this.modalLoading = false;
        const msg = err.error?.message || 'Stock adjustment failed.';
        this.toastService.error(msg);
      }
    });
  }

  openAuditModal(productId: number | null) {
    this.inventoryService.getAuditLogs(productId || undefined).subscribe({
      next: (res) => {
        if (res.success) {
          this.auditLogs.set(res.data);
          this.showAuditModal = true;
        }
      }
    });
  }

  closeOnBackdrop(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.showAdjustModal = false;
      this.showAuditModal = false;
    }
  }
}
