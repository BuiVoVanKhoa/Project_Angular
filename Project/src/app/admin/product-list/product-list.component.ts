import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  productForm: FormGroup;
  productType: string = '';
  products: IProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService
  ) {
    this.productForm = new FormGroup({
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      sale_price: new FormControl(0, Validators.min(0)),
      stock: new FormControl('', [Validators.required, Validators.min(0)]),
      size: new FormControl([]),
      color: new FormControl([]),
      image_url: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.productType = this.route.snapshot.paramMap.get('type') || '';
    if (this.productType) {
      this.loadProductData();
    }
  }

  // Lấy dữ liệu sản phẩm
  loadProductData() {
    this.masterService.getAllProducts().subscribe({
      next: (products) => {
        switch (this.productType) {
          case 'men':
            this.products = products.filter(p => p.category === 'men');
            break;
          case 'women':
            this.products = products.filter(p => p.category === 'women');
            break;
          case 'accessory':
            this.products = products.filter(p => p.category === 'accessory');
            break;
          default:
            this.products = products;
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  // Xóa sản phẩm
  onDelete(id: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.masterService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProductData();
          alert('Xóa sản phẩm thành công');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Có lỗi xảy ra khi xóa sản phẩm');
        }
      });
    }
  }

  // Hiển thị danh mục sản phẩm
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