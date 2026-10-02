import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Inventory, InventoryAdjustRequest, InventoryAuditLog } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8080/api/v1/inventory';

  constructor(private http: HttpClient) {}

  getAllInventory(): Observable<ApiResponse<Inventory[]>> {
    return this.http.get<ApiResponse<Inventory[]>>(this.apiUrl);
  }

  getInventoryByProductId(productId: number): Observable<ApiResponse<Inventory>> {
    return this.http.get<ApiResponse<Inventory>>(`${this.apiUrl}/product/${productId}`);
  }

  adjustStock(productId: number, request: InventoryAdjustRequest): Observable<ApiResponse<Inventory>> {
    return this.http.post<ApiResponse<Inventory>>(`${this.apiUrl}/adjust/${productId}`, request);
  }

  getLowStockAlerts(): Observable<ApiResponse<Inventory[]>> {
    return this.http.get<ApiResponse<Inventory[]>>(`${this.apiUrl}/low-stock-alerts`);
  }

  getAuditLogs(productId?: number): Observable<ApiResponse<InventoryAuditLog[]>> {
    let params = new HttpParams();
    if (productId) {
      params = params.set('productId', productId.toString());
    }
    return this.http.get<ApiResponse<InventoryAuditLog[]>>(`${this.apiUrl}/audit-logs`, { params });
  }
}
