import { CommonModule } from '@angular/common';
import { MasterService } from '../../service/master.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
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
  selector: 'app-product-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent {
  productFormCreate: FormGroup = new FormGroup({
    category: new FormControl('', Validators.required),
    subcategory: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    sale_price: new FormControl(0, Validators.min(0)),
    stock: new FormControl('', [Validators.required, Validators.min(0)]),
    size: new FormControl('', Validators.required),
    color: new FormControl('', Validators.required),
    image_url: new FormControl('', Validators.required),
  });

  constructor(private masterService: MasterService, private router: Router) {}

  onCreate() {
    if (this.productFormCreate.valid) {
      const formData = this.productFormCreate.value;

      // Chuyển đổi chuỗi size và color thành mảng
      const newProduct: Omit<IProduct, 'id'> = {
        ...formData,
        size: formData.size.split(',').map((s: string) => s.trim()),
        color: formData.color.split(',').map((c: string) => c.trim()),
      };

      this.masterService.createProduct(newProduct as IProduct).subscribe({
        next: () => {
          alert('Thêm sản phẩm thành công!');
          this.productFormCreate.reset();
          this.router.navigate(['/product-list']);
        },
        error: (error) => {
          console.error('Lỗi khi thêm sản phẩm:', error);
          alert('Có lỗi xảy ra khi thêm sản phẩm');
        },
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm');
    }
  }
}
