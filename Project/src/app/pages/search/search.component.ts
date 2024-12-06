import { IProduct } from './../../model/interface/master';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from '../../service/master.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-4">
      <h2>Kết quả tìm kiếm cho "{{searchQuery}}"</h2>
      
      <div *ngIf="searchResults.length === 0" class="alert alert-info">
        Không tìm thấy sản phẩm nào phù hợp với từ khóa tìm kiếm.
      </div>

      <div class="row">
        <div class="col-lg-3 col-md-6 mb-4" *ngFor="let product of searchResults">
          <div class="product-card">
            <img [src]="product.image_url" [alt]="product.name" class="product-image img-fluid" />
            <div class="product-name fw-bold fs-6 text-danger mt-2">
              {{ product.subcategory }}
            </div>
            <div class="product-title">{{ product.name }}</div>
            <div class="stars text-warning">★★★★★</div>
            <div *ngIf="product.sale_price > 0 && product.sale_price < product.price" class="product-price my-2">
              <span class="text-danger pe-2 fw-bold">{{ product.sale_price | number:'1.0-0' }} đ</span>
              <del class="text-muted fw-bold">{{ product.price | number:'1.0-0' }} đ</del>
            </div>
            <div *ngIf="!(product.sale_price > 0 && product.sale_price < product.price)" class="product-price my-2">
              <span class="fw-bold">{{ product.price | number:'1.0-0' }} đ</span>
            </div>
            <a class="text-decoration-none btn btn-success mx-2" (click)="addToCart(product)">
              Thêm vào giỏ hàng
            </a>
            <a class="text-decoration-none btn btn-danger" routerLink="/product-detail/{{product.id}}">
              Xem chi tiết
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: IProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private masterService: MasterService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.performSearch();
    });
  }

  performSearch() {
    this.masterService.getAllProducts().subscribe(products => {
      this.searchResults = products.filter(product => 
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    });
  }

  addToCart(product: IProduct) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.sale_price > 0 ? product.sale_price : product.price,
      quantity: 1,
      size: product.size[0] || '',
      color: product.color[0] || '',
      image_url: product.image_url
    };

    const existingItem = cart.find((item: any) => 
      item.productId === cartItem.productId && 
      item.size === cartItem.size && 
      item.color === cartItem.color
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm sản phẩm vào giỏ hàng');
  }
}