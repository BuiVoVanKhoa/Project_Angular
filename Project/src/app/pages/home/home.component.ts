import { Component, OnInit } from '@angular/core';
import { IBanner, IProduct } from '../../model/interface/master';
import { MasterService } from '../../service/master.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  banners: Array<IBanner> = [];
  productsMen: Array<IProduct> = [];
  productsWomen: Array<IProduct> = [];
  accessories: Array<IProduct> = [];
  cart: Array<any> = [];

  constructor(private masterService: MasterService) {}

  ngOnInit(): void {
    // Khởi tạo dữ liệu banner
    this.masterService.getBanners().subscribe((res) => {
      this.banners = res;
    });

    // Khởi tạo dữ liệu sản phẩm và phân loại trên client
    this.masterService.getAllProducts().subscribe((res) => {
      this.productsMen = res.filter((product) => product.category === 'men');
      this.productsWomen = res.filter(
        (product) => product.category === 'women'
      );
      this.accessories = res.filter(
        (product) => product.category === 'accessory'
      );
    });

    // Lấy giỏ hàng từ localStorage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }

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
      image_url: product.image_url,
    };
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = cart.find(
      (item: any) =>
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );

    // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng sản phẩm
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(cartItem);
    }
    // Lưu giỏ hàng vào localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm sản phẩm vào giỏ hàng');
  }
}
