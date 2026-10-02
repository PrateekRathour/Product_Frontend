import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, PagedResponse, Product, ProductFilter, ProductRequest } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private apiUrl = 'http://localhost:8080/api/v1/products';

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter = {}): Observable<ApiResponse<PagedResponse<Product>>> {
    let params = new HttpParams();

    if (filter.keyword) params = params.set('keyword', filter.keyword);
    if (filter.categoryId !== undefined && filter.categoryId !== null) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.categorySlug) params = params.set('categorySlug', filter.categorySlug);
    if (filter.minPrice !== undefined && filter.minPrice !== null) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice !== undefined && filter.maxPrice !== null) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.inventoryStatus) params = params.set('inventoryStatus', filter.inventoryStatus);
    if (filter.brand) params = params.set('brand', filter.brand);
    if (filter.featured !== undefined) params = params.set('featured', filter.featured.toString());
    if (filter.active !== undefined) params = params.set('active', filter.active.toString());
    if (filter.page !== undefined) params = params.set('page', filter.page.toString());
    if (filter.size !== undefined) params = params.set('size', filter.size.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortDir) params = params.set('sortDir', filter.sortDir);

    return this.http.get<ApiResponse<PagedResponse<Product>>>(this.apiUrl, { params });
  }

  getFeaturedProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/featured`);
  }

  getProductById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/slug/${slug}`);
  }

  createProduct(product: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
  }

  toggleProductActive(id: number): Observable<ApiResponse<Product>> {
    return this.http.patch<ApiResponse<Product>>(`${this.apiUrl}/${id}/toggle-active`, {});
  }

  deleteProduct(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
