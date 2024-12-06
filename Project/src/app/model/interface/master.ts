export interface IApiResponse {
  message: string;
  result: boolean;
  data: any;
}

export interface IBanner {
  id: number;
  imageUrl: string;
}

export interface IProduct{
  id: string;
  category: string;
  subcategory: string,
  name: string;
  description: string;
  price: number;
  sale_price: number;
  stock: number;
  size: string[];
  color: string[];
  image_url: string;
}