import { MasterService } from './../../service/master.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

interface IProduct {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  description: string;
  price: number;
  sale_price: number;
  stock: number;
  size: string[];
  color: string[];
  image_url: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productId: string = '';
  product?: IProduct;
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProductDetail();
    } else {
      this.router.navigate(['/']);
    }
  }

  loadProductDetail() {
    this.masterService.getAllProducts().subscribe({
      next: (products) => {
        const product = products.find(p => p.id === this.productId);
        if (product) {
          this.product = product;
          this.selectedSize = product.size.length > 0 ? product.size[0] : '';
          this.selectedColor = product.color.length > 0 ? product.color[0] : '';
        } else {
          alert('Không tìm thấy sản phẩm');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        alert('Có lỗi xảy ra khi tải thông tin sản phẩm');
      }
    });
  }

  onSizeChange(size: string) {
    this.selectedSize = size;
  }

  onColorChange(color: string) {
    this.selectedColor = color;
  }

  updateQuantity(change: number) {
    const newQuantity = this.quantity + change;
    if (this.product && newQuantity >= 1 && newQuantity <= this.product.stock) {
      this.quantity = newQuantity;
    }
  }

  addToCart() {
    if (!this.product || !this.selectedSize || !this.selectedColor) {
      alert('Vui lòng chọn size và màu sắc');
      return;
    }
  
    const cartItem = {
      productId: this.product.id,
      name: this.product.name,
      price: this.product.sale_price > 0 ? this.product.sale_price : this.product.price,
      quantity: this.quantity,
      size: this.selectedSize,
      color: this.selectedColor,
      image_url: this.product.image_url
    };
  
    // Lấy giỏ hàng từ localStorage và kiểm tra xem sản phẩm đã tồn tại chưa
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => 
      item.productId === cartItem.productId && 
      item.size === cartItem.size && 
      item.color === cartItem.color
    );
  
    if (existingItem) {
      existingItem.quantity += this.quantity;
    } else {
      cart.push(cartItem);
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm sản phẩm vào giỏ hàng');
  }

  getCategoryDisplay(category: string): string {
    switch (category) {
      case 'men':
        return 'Thời trang nam';
      case 'women':
        return 'Thời trang nữ';
      case 'accessory':
        return 'Phụ kiện';
      default:
        return category;
    }
  }
}
