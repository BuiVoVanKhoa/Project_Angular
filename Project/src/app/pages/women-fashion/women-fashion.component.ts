import { Component } from '@angular/core';
import { IProduct } from '../../model/interface/master';
import { MasterService } from '../../service/master.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-women-fashion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './women-fashion.component.html',
  styleUrl: './women-fashion.component.css',
})
export class WomenFashionComponent {
  filteredProducts: IProduct[] = [];
  productWomen: IProduct[] = [];
  cart: any[] = [];

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    this.masterService.getAllProductsWomen().subscribe((res) => {
      this.productWomen = res.filter((product) => product.category === 'women');
      this.filteredProducts = [...this.productWomen];
    });
  }

  // Hàm lọc sản phẩm theo giá
  filterProductsByPrice(event: any) {
    const selectedPriceRange = event.target.value;
    if (selectedPriceRange === '0') {
      this.filteredProducts = [...this.productWomen];
    } else {
      const [minPrice, maxPrice] = selectedPriceRange.split('-').map(Number);
      this.filteredProducts = this.productWomen.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }
  }

  // Hàm thêm sản phẩm vào giỏ hàng
  addToCart(product: IProduct) {
    // Lấy giỏ hàng hiện tại từ localStorage
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
