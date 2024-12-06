import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  OnInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Project';
  @ViewChild('loginModal') loginModal!: ElementRef;
  @ViewChild('registerModal') registerModal!: ElementRef;

  isLoginVisible: boolean = false;
  isRegisterVisible: boolean = false;
  isLoggedIn: boolean = false;
  isUserInfoVisible: boolean = false;
  isUserInfoModalVisible: boolean = false;
  loginEmail: string = '';
  loginPassword: string = '';
  registerEmail: string = '';
  registerPassword: string = '';
  username: string = '';
  rememberMe: boolean = false;
  userAddress: string = '';
  userPhone: string = '';
  newPassword: string = '';
  isBrowser: boolean;
  isChangePasswordVisible: boolean = false;
  currentPassword: string = '';
  errorMessage: string = '';
  isSocialButtonsActive = false;
  isCouponModalVisible = false;
  isCouponInputVisible = false;
  enteredCoupon = '';

  coupons: { code: string; discount: number }[] = [];

  constructor(@Inject(PLATFORM_ID) platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  search(query: string) {
    if (query.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: query } });
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Kiểm tra trạng thái đăng nhập từ localStorage
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        this.isLoggedIn = true;
        this.username = loggedInUser;
      }
      this.checkRememberedLogin();
    }
  }

  openCart() {
    if (this.isLoggedIn) {
      this.router.navigate(['/cart']);
    } else {
      this.showLoginForm();
      this.router.navigate(['']);
    }
  }

  showUserInfo() {
    this.isUserInfoModalVisible = true;
  }

  closeUserInfoModal() {
    this.isUserInfoModalVisible = false;
  }

  toggleChangePassword() {
    this.isChangePasswordVisible = !this.isChangePasswordVisible;
    if (!this.isChangePasswordVisible) {
      this.currentPassword = '';
      this.newPassword = '';
    }
  }

  updateUserInfo() {
    if (this.ValidateNumber(this.userPhone)) {
      if (this.isBrowser) {
        if (this.isChangePasswordVisible) {
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const currentUser = users.find(
            (user: any) => user.email === this.username
          );

          if (!currentUser) {
            alert('Không tìm thấy thông tin người dùng!');
            return;
          }

          if (currentUser.password !== this.currentPassword) {
            alert('Mật khẩu hiện tại không chính xác!');
            return;
          }

          currentUser.password = this.newPassword;
          localStorage.setItem('users', JSON.stringify(users));

          if (this.rememberMe) {
            localStorage.setItem('rememberedPassword', this.newPassword);
          }
        }

        alert('Thông tin đã được cập nhật thành công!');
        this.isChangePasswordVisible = false;
        this.currentPassword = '';
        this.newPassword = '';
      }
    } else {
      alert('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
      this.userPhone = '';
      const phoneInput = document.getElementById('userPhone');
      if (phoneInput) {
        phoneInput.focus();
      }
    }
  }

  ValidateNumber(phoneNumber: string): boolean {
    if (!phoneNumber || phoneNumber.trim() === '') {
      return true;
    }
    phoneNumber = phoneNumber.trim();

    if (phoneNumber.startsWith('84')) {
      phoneNumber = '+84 ' + phoneNumber.substring(2);
      this.userPhone = phoneNumber;
    }

    const phoneRegex = /^[0-9]+$/;

    if (phoneNumber.startsWith('+84 ')) {
      const numberWithoutPrefix = phoneNumber.substring(4).replace(/\s/g, '');
      if (!phoneRegex.test(numberWithoutPrefix)) {
        return false;
      }

      if (numberWithoutPrefix.startsWith('0')) {
        return numberWithoutPrefix.length === 10;
      } else {
        return numberWithoutPrefix.length === 9;
      }
    } else if (phoneNumber.startsWith('0')) {
      return phoneRegex.test(phoneNumber) && phoneNumber.length === 10;
    } else {
      return false;
    }
  }

  showLoginForm() {
    this.isLoginVisible = true;
    this.isRegisterVisible = false;
    document.body.style.overflow = 'hidden';
  }

  showRegisterForm() {
    this.isRegisterVisible = true;
    this.isLoginVisible = false;
  }

  closeModal() {
    this.isLoginVisible = false;
    this.isRegisterVisible = false;
    document.body.style.overflow = 'auto';
  }

  checkRememberedLogin() {
    if (this.isBrowser) {
      const rememberedEmail = localStorage.getItem('rememberedEmail');
      const rememberedPassword = localStorage.getItem('rememberedPassword');
      const rememberMeStatus = localStorage.getItem('rememberMe');

      this.rememberMe = rememberMeStatus === 'true';

      if (rememberedEmail && rememberedPassword && this.rememberMe) {
        this.loginEmail = rememberedEmail;
        this.loginPassword = rememberedPassword;
        this.login(true);
      }
    }
  }

  register() {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(
      (user: any) => user.email === this.registerEmail
    );
    if (existingUser) {
      alert('Email đã tồn tại. Vui lòng sử dụng email khác.');
      return;
    }

    // Phân chia vai trò là admin cho email cụ thể
    const userRole =
      this.registerEmail === 'nhom9@gmail.com' ? 'admin' : 'user';

    users.push({
      email: this.registerEmail,
      password: this.registerPassword,
      role: userRole,
    });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Đăng ký thành công! Bạn có thể đăng nhập.');
    this.registerEmail = '';
    this.registerPassword = '';
    this.closeModal();
  }

  login(isAutoLogin: boolean = false) {
    if (this.isBrowser) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(
        (user: any) =>
          user.email === this.loginEmail && user.password === this.loginPassword
      );

      if (user) {
        this.isLoggedIn = true;
        this.username = user.email;

        // Lưu trạng thái đăng nhập
        localStorage.setItem('loggedInUser', this.loginEmail);

        if (this.rememberMe) {
          localStorage.setItem('rememberedEmail', this.loginEmail);
          localStorage.setItem('rememberedPassword', this.loginPassword);
          localStorage.setItem('rememberMe', 'true');
        }

        if (!isAutoLogin) {
          alert('Đăng nhập thành công!');
        }
        this.isUserInfoVisible = false;
        this.closeModal();

        // Kiểm tra vai trò của người dùng và điều hướng
        if (user.role === 'admin') {
          this.router.navigate(['/home-admin']);
        } else {
          this.router.navigate(['']);
        }
      } else {
        alert('Thông tin đăng nhập không chính xác.');
      }
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.username = '';
    // Xóa trạng thái đăng nhập khỏi localStorage
    localStorage.removeItem('loggedInUser');

    if (!this.rememberMe) {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMe');
    }

    this.closeUserInfoModal();
    this.router.navigate(['']);
  }

  toggleUserInfo(event: Event) {
    event.stopPropagation();
    this.isUserInfoVisible = !this.isUserInfoVisible;
  }

  toggleSocialButtons(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isSocialButtonsActive = !this.isSocialButtonsActive;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (
      this.isUserInfoVisible &&
      !(event.target as HTMLElement).closest('.position-relative')
    ) {
      this.isUserInfoVisible = false;
    }
  }

  navigateToSocial(event: Event, url: string) {
    event.preventDefault();
    event.stopPropagation();
    window.open(url, '_blank');
  }

  onDocumentClick(event: Event) {
    const phoneButton = document.querySelector('.social-button.phone');
    if (!phoneButton?.contains(event.target as Node)) {
      return;
    }
  }

  showCouponModal() {
    this.isCouponModalVisible = true;
  }

  closeCouponModal() {
    this.isCouponModalVisible = false;
  }

  toggleCouponInput() {
    this.isCouponInputVisible = !this.isCouponInputVisible;
  }

  removeCoupon(index: number) {
    this.coupons.splice(index, 1);
  }
}
