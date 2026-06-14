export type TorderItem = {
  id: number;
  name: string;
  image: string;
  order_id: number;
  prosuct_id: number;
  price: number;
  quantity: number;
};

export type Torders = {
  id: string;
  user_id: string;
  total_price: number;
  orderItems: TorderItem[];
  status: TorderStatus;
  shipping_address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes?: string;
  } | null;
  created_at: string;
};
export type TorderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";
