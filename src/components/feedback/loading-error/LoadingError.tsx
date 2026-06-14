import type { Tloading } from "../../../types/shared";
import CategoriesSkelaton from "../skelatons/ctegories/CategoriesSkelaton";
import ProductSkeleton from "../skelatons/products/ProductsSkelaton";
import CartSkeleton from "../skelatons/cart/CartSkelaton";
import LottiesHandler from "../lotties/LottiesHandler";
import OrdersSkeleton from "../skelatons/order/OrdersSkeleton";

const skelatons = {
  categories: CategoriesSkelaton,
  products: ProductSkeleton,
  cart: CartSkeleton,
  order: OrdersSkeleton,
};

type LoadingProps = {
  status: Tloading;
  error: null | string;
  children: React.ReactNode;
  type: keyof typeof skelatons;
};

const LoadingError = ({ status, error, children, type }: LoadingProps) => {
  const SkelComponent = skelatons[type];
  if (status === "pending") {
    return <SkelComponent />;
  }
  if (status === "failed") {
    return (
      <div>
        <LottiesHandler type="error" message={error as string} />
      </div>
    );
  }
  return <div>{children}</div>;
};

export default LoadingError;
