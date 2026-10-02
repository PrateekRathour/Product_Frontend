export type InventoryStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  bannerUrl?: string;
  active: boolean;
  displayOrder?: number;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  bannerUrl?: string;
  active?: boolean;
  displayOrder?: number;
}

export interface Inventory {
  id: number;
  sku: string;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  status: InventoryStatus;
  warehouseLocation: string;
  lastRestockedAt?: string;
  updatedAt?: string;
}

export interface InventoryAdjustRequest {
  changeQuantity: number;
  reason: string;
  newThreshold?: number;
  warehouseLocation?: string;
}

export interface InventoryAuditLog {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  changeQuantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  performedBy: string;
  timestamp: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  brand?: string;
  featured: boolean;
  active: boolean;
  rating: number;
  category: Category;
  inventory?: Inventory;
  createdAt: string;
  updatedAt: string;
}

export interface ProductRequest {
  name: string;
  slug?: string;
  sku: string;
  description?: string;
  price: number;
  discountPrice?: number;
  imageUrl?: string;
  brand?: string;
  featured?: boolean;
  active?: boolean;
  rating?: number;
  categoryId: number;
  initialStock?: number;
  lowStockThreshold?: number;
  warehouseLocation?: string;
}

export interface ProductFilter {
  keyword?: string;
  categoryId?: number;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inventoryStatus?: InventoryStatus;
  brand?: string;
  featured?: boolean;
  active?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
