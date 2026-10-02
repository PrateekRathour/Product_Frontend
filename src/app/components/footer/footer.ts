import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="border-t border-slate-800/80 bg-slate-950/90 mt-20 text-slate-400 text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <!-- Column 1: App Info -->
          <div class="md:col-span-2 space-y-4">
            <div class="flex items-center gap-2">
              <span class="font-bold text-lg text-white">NexusCatalog</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                System Active
              </span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed max-w-md">
              Enterprise-grade 3-Tier layered Product & Inventory Catalog architecture built with Spring Boot 3, Angular standalone components, Spring Security JWT role-based access control, and MySQL Workbench database persistence.
            </p>
            <div class="flex flex-wrap gap-2 text-[11px] font-mono text-slate-300">
              <span class="px-2 py-1 rounded bg-slate-900 border border-slate-800">☕ Spring Boot 3.3</span>
              <span class="px-2 py-1 rounded bg-slate-900 border border-slate-800">🅰️ Angular Standalone</span>
              <span class="px-2 py-1 rounded bg-slate-900 border border-slate-800">🐬 MySQL 8.0</span>
              <span class="px-2 py-1 rounded bg-slate-900 border border-slate-800">🔐 JWT Security (RBAC)</span>
            </div>
          </div>

          <!-- Column 2: Architectural Layers -->
          <div>
            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">3-Tier Architecture</h4>
            <ul class="space-y-2 text-xs">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Web / Controller Layer (REST)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Business / Service Layer</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Data Access / JPA Repositories</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span>Spring Security & RBAC Guards</span>
              </li>
            </ul>
          </div>

          <!-- Column 3: Quick Endpoints -->
          <div>
            <h4 class="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Developer Endpoints</h4>
            <ul class="space-y-2 text-xs">
              <li><a href="http://localhost:8080/swagger-ui.html" target="_blank" class="text-indigo-400 hover:underline">Swagger UI Docs</a></li>
              <li><a href="http://localhost:8080/api-docs" target="_blank" class="text-indigo-400 hover:underline">OpenAPI JSON Spec</a></li>
              <li><span class="text-slate-500">API Prefix: /api/v1/*</span></li>
              <li><span class="text-slate-500">Port: localhost:8080</span></li>
            </ul>
          </div>

        </div>

        <div class="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 NexusCatalog Application. Running locally on localhost.</p>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5 text-emerald-400">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Local Database Synchronized
            </span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
