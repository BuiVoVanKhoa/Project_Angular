import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MenFashionComponent } from './pages/men-fashion/men-fashion.component';
import { WomenFashionComponent } from './pages/women-fashion/women-fashion.component';
import { AccessoryComponent } from './pages/accessory/accessory.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductCreateComponent } from './admin/product-create/product-create.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { ProductEditComponent } from './admin/product-edit/product-edit.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { HomeAdminComponent } from './admin/home-admin/home-admin.component';
import { SearchComponent } from './pages/search/search.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'men-fashion', component: MenFashionComponent },
  { path: 'women-fashion', component: WomenFashionComponent },
  { path: 'accessories', component: AccessoryComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  // Admin routes

  { path: 'home-admin', component: HomeAdminComponent },

  {
    path: 'product-create',
    component: ProductCreateComponent,
  },
  {
    path: 'product-list',
    component: ProductListComponent,
  },
  {
    path: 'product-edit/:id',
    component: ProductEditComponent,
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
  },
  { path: 'search', component: SearchComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect tất cả các đường dẫn không hợp lệ về trang chủ
];
