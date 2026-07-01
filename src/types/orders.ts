export type TorderItem = {
  id: number;
  name: string;
  image: string;
  order_id: number;
  product_id: number;
  price: number;
  quantity: number;
};

export type TpaymentStatus = "unpaid" | "paid" | "refunded" | "failed";

export type Torders = {
  id: string;
  user_id: string;
  total_price: number;
  orderItems: TorderItem[];
  status: TorderStatus;
  payment_status: TpaymentStatus;
  stripe_session_id: string | null;
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
