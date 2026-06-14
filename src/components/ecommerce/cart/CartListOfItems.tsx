import CartItem from "./cart-item/CartItem";
import type { Tproduct } from "../../../types/product";

type CartItemListProps = {
  products: Tproduct[];
  removeFromCartHandeler: (id: number) => void;
  changeCartItemQunHandeler: (id: number, quntity: number) => void;
};

const CartListOfItems = ({
  products,
  removeFromCartHandeler,
  changeCartItemQunHandeler,
}: CartItemListProps) => {
  return (
    <div>
      {products.map((el) => (
        <CartItem
          key={el.id}
          {...el}
          removeFromCartHandeler={removeFromCartHandeler}
          changeCartItemQunHandeler={changeCartItemQunHandeler}
        />
      ))}
    </div>
  );
};

export default CartListOfItems;
