import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBanner, IProduct } from '../model/interface/master';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiUrl: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  // Gửi yêu cầu GET đến API để lấy tất cả các banner
  getBanners(): Observable<Array<IBanner>> {
    return this.http.get<Array<IBanner>>(this.apiUrl + 'banner');
  }

  // Gửi yêu cầu GET đến API để lấy tất cả các sản phẩm
  getAllProducts(): Observable<Array<IProduct>> {
    return this.http.get<Array<IProduct>>(this.apiUrl + 'products');
  }

  // Lọc sản phẩm theo category: thời trang nam
  getAllProductsMen(): Observable<Array<IProduct>> {
    return this.getAllProducts().pipe(
      map((products) =>
        products.filter((product) => product.category === 'men')
      )
    );
  }

  // Lọc sản phẩm theo category: thời trang nữ
  getAllProductsWomen(): Observable<Array<IProduct>> {
    return this.getAllProducts().pipe(
      map((products) =>
        products.filter((product) => product.category === 'women')
      )
    );
  }

  // Lọc sản phẩm theo category: phụ kiện
  getAllProductsAccessories(): Observable<Array<IProduct>> {
    return this.getAllProducts().pipe(
      map((products) =>
        products.filter((product) => product.category === 'accessory')
      )
    );
  }

  // Thêm sản phẩm vào danh mục sản phẩm
  createProduct(data: IProduct): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'products', data);
  }

  // Cập nhật sản phẩm theo ID
  updateProduct(id: string, data: IProduct): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}products/${id}`, data);
  }

  // Xóa sản phẩm theo ID
  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}products/${id}`);
  }

  searchProducts(keyword: string): Observable<IProduct[]> {
    return this.getAllProducts().pipe(
      map(products => products.filter(product => 
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.description.toLowerCase().includes(keyword.toLowerCase()) ||
        product.subcategory.toLowerCase().includes(keyword.toLowerCase())
      ))
    );
  }
}
