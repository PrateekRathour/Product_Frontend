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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in space-y-8">
      
      <!-- Top Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Warehouse & Stock Operations
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Real-Time Inventory Hub</h1>
          <p class="text-sm text-slate-400 mt-1">
            Monitor real-time warehouse quantities, set reorder thresholds, and execute auditable stock adjustments.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button (click)="openAuditModal(null)" class="btn btn-secondary text-xs py-2 px-3.5 flex items-center gap-2">
            📜 Global Audit Trail
          </button>
          <button (click)="loadInventories()" class="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-2">
            🔄 Refresh Stock
          </button>
        </div>
      </div>

      <!-- Low Stock Alert Banner -->
      <div *ngIf="lowStockCount() > 0" class="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            ⚠️
          </div>
          <div>
            <h4 class="text-sm font-bold text-amber-200">Attention: {{ lowStockCount() }} Items Require Attention</h4>
            <p class="text-xs text-amber-300/80">Stock levels have fallen below safety threshold or are currently depleted.</p>
          </div>
        </div>
        <button (click)="filterStatus = 'LOW_STOCK'" class="btn btn-secondary text-xs border-amber-500/30 text-amber-300 hover:bg-amber-950">
          View Critical Items
        </button>
      </div>

      <!-- Filters & Quick Search -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <button (click)="filterStatus = null" 
                  [ngClass]="filterStatus === null ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            All Items ({{ inventories().length }})
          </button>
          <button (click)="filterStatus = 'LOW_STOCK'" 
                  [ngClass]="filterStatus === 'LOW_STOCK' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            ⚠️ Low Stock
          </button>
          <button (click)="filterStatus = 'OUT_OF_STOCK'" 
                  [ngClass]="filterStatus === 'OUT_OF_STOCK' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            🛑 Out of Stock
          </button>
          <button (click)="filterStatus = 'IN_STOCK'" 
                  [ngClass]="filterStatus === 'IN_STOCK' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'"
                  class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
            ✅ In Stock
          </button>
        </div>

        <div class="w-full sm:w-64">
          <input type="text" [(ngModel)]="searchKeyword" placeholder="Search SKU or location..." 
                 class="input-control text-xs py-2 bg-slate-900/90 border-slate-800">
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="table-container glass-panel">
        <table class="custom-table">
          <thead>
            <tr>
              <th>SKU / Identifier</th>
              <th>Status</th>
              <th>Stock Quantity</th>
              <th>Reserved</th>
              <th>Available</th>
              <th>Reorder Level</th>
              <th>Warehouse</th>
              <th class="text-right">Quick Stock Operations</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of filteredInventories()">
              <td>
                <span class="sku-pill font-mono">{{ item.sku }}</span>
              </td>
              <td>
                <span *ngIf="item.status === 'IN_STOCK'" class="badge badge-in-stock text-[10px]">In Stock</span>
                <span *ngIf="item.status === 'LOW_STOCK'" class="badge badge-low-stock text-[10px]">Low Stock</span>
                <span *ngIf="item.status === 'OUT_OF_STOCK'" class="badge badge-out-of-stock text-[10px]">Out of Stock</span>
              </td>
              <td>
                <span class="font-mono font-bold text-white text-base">{{ item.stockQuantity }}</span>
              </td>
              <td>
                <span class="font-mono text-slate-400">{{ item.reservedQuantity }}</span>
              </td>
              <td>
                <span class="font-mono font-bold text-emerald-400">{{ item.availableQuantity }}</span>
              </td>
              <td>
                <span class="font-mono text-slate-400">{{ item.lowStockThreshold }}</span>
              </td>
              <td>
                <span class="text-xs text-slate-300">{{ item.warehouseLocation }}</span>
              </td>
              <td class="text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button (click)="quickRestock(item, 10)" title="Add 10 units" 
                          class="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all">
                    +10
                  </button>
                  <button (click)="openAdjustModal(item)" title="Custom adjustment"
                          class="px-2.5 py-1 rounded bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all">
                    Adjust
                  </button>
                  <button (click)="openAuditModal(item.id)" title="View Audit Logs"
                          class="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs">
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
          const low = res.data.filter(i => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length;
          this.lowStockCount.set(low);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.toastService.error('Failed to load inventories.');
      }
    });
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
