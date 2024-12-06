import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  filteredCart: any[] = [];
  totalAmount: number = 0;
  searchTerm: string = '';
  voucherCode: string = '';
  discountAmount: number = 0;
  shippingFee: number = 10; // Phí vận chuyển
  isCheckoutVisible: boolean = false; // Biến kiểm tra trạng thái checkout

  customerName: string = '';
  customerAddress: string = '';
  customerPhone: string = '';
  paymentMethod: string = '';
  creditCardNumber: string = '';

  // Danh sách mã giảm giá có sẵn
  availableVouchers: { code: string; discountRate: number }[] = [
    { code: 'DISCOUNT10', discountRate: 0.1 }, // Giảm 10%
    { code: 'DISCOUNT20', discountRate: 0.2 }, // Giảm 20%
    { code: 'DISCOUNT30', discountRate: 0.3 }, // Giảm 30%
    { code: 'DISCOUNT50', discountRate: 0.5 }, // Giảm 50%
    { code: 'BLACKFRIDAY', discountRate: 0.4 }, // Giảm 40% cho Black Friday
    { code: 'SUMMERSALE', discountRate: 0.15 }, // Giảm 15% cho Summer Sale
    { code: 'WELCOME', discountRate: 0.05 }, // Giảm 5% cho khách hàng mới
  ];

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
      this.cart.forEach((product) => (product.selected = false)); // Đặt thuộc tính selected cho từng sản phẩm
      this.filteredCart = [...this.cart]; // Khởi tạo filteredCart với tất cả sản phẩm
      this.calculateTotal(); // Tính tổng tiền khi tải giỏ hàng
    }
  }

  // Hàm tăng số lượng sản phẩm
  increaseQuantity(product: any) {
    product.quantity += 1;
    this.calculateTotal();
    this.updateLocalStorage();
  }

  // Hàm giảm số lượng sản phẩm
  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      this.removeProduct(product); // Xóa sản phẩm nếu số lượng là 1 và người dùng nhấn giảm
    }
    this.calculateTotal();
    this.updateLocalStorage();
  }

  // Hàm xóa sản phẩm khỏi giỏ hàng
  removeProduct(product: any) {
    this.cart = this.cart.filter(
      (item) =>
        !(
          item.productId === product.productId &&
          item.size === product.size &&
          item.color === product.color
        )
    );
    this.filterProducts(); // Cập nhật filteredCart sau khi xóa sản phẩm
    this.calculateTotal();
    this.updateLocalStorage();
  }

  // Hàm chọn hoặc bỏ chọn tất cả sản phẩm
  toggleSelectAll() {
    const newSelectState = !this.isAllSelected();
    this.filteredCart.forEach((product) => (product.selected = newSelectState));
    this.calculateTotal();
  }

  // Kiểm tra xem tất cả sản phẩm có được chọn không
  isAllSelected(): boolean {
    return this.filteredCart.every((product) => product.selected);
  }

  // Tính tổng tiền, phí vận chuyển, và áp dụng giảm giá
  calculateTotal() {
    const totalWithoutDiscount = this.filteredCart
      .filter((product) => product.selected)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Phí vận chuyển bằng 10% tổng tiền chưa giảm giá
    this.shippingFee = totalWithoutDiscount * 0.1;

    // Tổng tiền bao gồm phí vận chuyển và giảm giá
    this.totalAmount =
      totalWithoutDiscount - this.discountAmount + this.shippingFee;
  }

  // Hàm lọc sản phẩm theo từ khóa tìm kiếm
  filterProducts() {
    this.filteredCart = this.cart.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.calculateTotal(); // Tính lại tổng tiền dựa trên danh sách lọc
  }

  // Hàm xử lý khi nhấn "Mua Hàng"
  checkout() {
    const selectedProducts = this.filteredCart.filter(
      (product) => product.selected
    );
    if (selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để mua.');
      return;
    }
    // Hiển thị form thanh toán (pop-up modal)
    this.isCheckoutVisible = true;
  }

  // Hàm quay lại giỏ hàng
  goBackToCart() {
    this.isCheckoutVisible = false;
  }

  // Hàm áp dụng mã giảm giá
  applyVoucher() {
    const selectedVoucher = this.availableVouchers.find(
      (voucher) => voucher.code === this.voucherCode
    );

    if (selectedVoucher) {
      this.discountAmount =
        this.filteredCart
          .filter((product) => product.selected)
          .reduce((sum, item) => sum + item.price * item.quantity, 0) *
        selectedVoucher.discountRate;
      alert(`Mã giảm giá ${selectedVoucher.code} đã được áp dụng thành công!`);
    } else {
      alert('Mã giảm giá không hợp lệ.');
      this.discountAmount = 0;
    }

    this.calculateTotal();
  }

  // Cập nhật giỏ hàng trong localStorage
  updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Hàm xác nhận thanh toán và xóa giỏ hàng
  confirmPayment(form: any) {
    if (form.invalid) {
      alert('Vui lòng điền đầy đủ thông tin trước khi đặt hàng.');
      return;
    }

    // Lọc các sản phẩm chưa được chọn để giữ lại trong giỏ hàng
    this.cart = this.cart.filter((product) => !product.selected);
    this.filteredCart = this.cart; // Cập nhật filteredCart với danh sách sản phẩm còn lại

    // Cập nhật lại localStorage với giỏ hàng mới
    localStorage.setItem('cart', JSON.stringify(this.cart));

    this.voucherCode = ''; // Mã giảm giá trở về trống
    this.discountAmount = 0; // Số tiền giảm giá trở về 0

    // Tính lại tổng tiền và ẩn form thanh toán
    this.calculateTotal();
    this.isCheckoutVisible = false;

    alert(
      'Thanh toán thành công! Các sản phẩm đã chọn đã được xóa khỏi giỏ hàng.'
    );
  }
}
