export interface CategoryStat {
  categoryName: string;
  slug: string;
  productCount: number;
  totalUnits: number;
  inventoryValuation: number;
}

export interface RecentActivity {
  type: string;
  title: string;
  description: string;
  user: string;
  timestamp: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalStockUnits: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeProductsCount: number;
  categoryDistribution: CategoryStat[];
  recentActivities: RecentActivity[];
}
