export type Tproduct = {
  id?: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category_id: number;
  image: string;
  quantity?: number; // for cart
  isLiked?: boolean; // for wishlist
};
