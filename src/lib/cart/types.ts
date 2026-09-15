export interface CartItem {
  slug: string;
  name: string;
  image?: string;
  priceUnit?: string;
  price?: number;
  quantity: number;
}
