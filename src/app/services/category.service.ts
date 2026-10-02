import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Category, CategoryRequest } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient) {}

  getCategories(onlyActive: boolean = false): Observable<ApiResponse<Category[]>> {
    const params = new HttpParams().set('onlyActive', onlyActive.toString());
    return this.http.get<ApiResponse<Category[]>>(this.apiUrl, { params });
  }

  getCategoryById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/${id}`);
  }

  getCategoryBySlug(slug: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/slug/${slug}`);
  }

  createCategory(category: CategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.apiUrl, category);
  }

  updateCategory(id: number, category: CategoryRequest): Observable<ApiResponse<Category>> {
    return this.http.put<ApiResponse<Category>>(`${this.apiUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
