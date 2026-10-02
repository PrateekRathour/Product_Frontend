import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog';
import { ProductDetailComponent } from './pages/product-detail/product-detail';
import { CategoriesComponent } from './pages/categories/categories';
import { InventoryDashboardComponent } from './pages/inventory/inventory';
import { AdminDashboardComponent } from './pages/admin/admin';
import { adminGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:slug', component: ProductDetailComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'inventory', component: InventoryDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'catalog' }
];
