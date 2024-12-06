import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MasterService } from '../../service/master.service';

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
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css',
})
export class ProductEditComponent implements OnInit {
  productFormEdit: FormGroup;
  productId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService
  ) {
    this.productFormEdit = new FormGroup({
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      sale_price: new FormControl(0, Validators.min(0)),
      stock: new FormControl('', [Validators.required, Validators.min(0)]),
      size: new FormControl('', Validators.required),
      color: new FormControl('', Validators.required),
      image_url: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProductData();
    }
  }

  loadProductData() {
    this.masterService.getAllProducts().subscribe({
      next: (products) => {
        const product = products.find(p => p.id === this.productId);
        if (product) {
          this.productFormEdit.patchValue({
            category: product.category,
            subcategory: product.subcategory,
            name: product.name,
            description: product.description,
            price: product.price,
            sale_price: product.sale_price,
            stock: product.stock,
            size: product.size.join(', '),
            color: product.color.join(', '),
            image_url: product.image_url
          });
        } else {
          alert('Không tìm thấy sản phẩm');
          this.router.navigate(['/product-list']);
        }
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm:', error);
        alert('Có lỗi xảy ra khi tải thông tin sản phẩm');
      }
    });
  }

  onUpdate() {
    if (this.productFormEdit.valid) {
      const formData = this.productFormEdit.value;
      
      // Chuyển đổi chuỗi size và color thành mảng
      const updatedProduct: IProduct = {
        id: this.productId,
        ...formData,
        size: formData.size.split(',').map((s: string) => s.trim()),
        color: formData.color.split(',').map((c: string) => c.trim())
      };

      this.masterService.updateProduct(this.productId, updatedProduct).subscribe({
        next: () => {
          alert('Cập nhật sản phẩm thành công!');
          this.router.navigate(['/product-list']);
        },
        error: (error) => {
          console.error('Lỗi khi cập nhật sản phẩm:', error);
          alert('Có lỗi xảy ra khi cập nhật sản phẩm');
        }
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm');
    }
  }
}