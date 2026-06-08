export interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  images?: string[];
  stock?: number;
  featured?: boolean;
  rating?: number;
  numReviews?: number;
}
