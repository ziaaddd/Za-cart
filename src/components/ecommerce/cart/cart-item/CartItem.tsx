import { memo } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Tproduct } from "../../../../types/product";
import styles from "./CartItem.module.css";

const { cartItem, productImg, actionsPanel, removeBtn } = styles;

type CartItemProps = Tproduct & {
  removeFromCartHandeler: (id: number) => void;
  changeCartItemQunHandeler: (id: number, quantity: number) => void;
};

const CartItem = ({
  id,
  name,
  image,
  price,
  stock,
  quantity = 1,
  category_id,
  removeFromCartHandeler,
  changeCartItemQunHandeler,
}: CartItemProps) => {
  const subtotal = price * (quantity ?? 1);
  const remainingStock = stock - quantity!;

  const handleAddToCart = () => {
    const newQuantity = quantity + 1;
    changeCartItemQunHandeler(id!, Number(newQuantity));
  };
  const handleRemoveFromCart = () => {
    const newQuantity = quantity - 1;
    changeCartItemQunHandeler(id!, Number(newQuantity));
  };

  return (
    <div
      className={`${cartItem} d-flex align-items-center just justify-content-between  py-4 px-3 mb-3 `}
    >
      <div className="d-flex align-items-center gap-3 ">
        <Link
          to={`/categories/products/${category_id}/${id}`}
          className={productImg}
        >
          <img src={image} alt={name} />
        </Link>

        <div>
          <Link
            to={`/categories/products/${category_id}/${id}`}
            className="text-decoration-none text-dark fw-semibold fs-6 d-block mb-3"
          >
            {name}
          </Link>

          <span className="text-info fs-6">Piece: {price.toFixed(2)} EGP</span>
          <div>
            <div className="fw-bold fs-6">Total: {subtotal.toFixed(2)} EGP</div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className={actionsPanel}>
        <button
          className={removeBtn}
          onClick={() => id && removeFromCartHandeler(id)}
        >
          remove
        </button>
        <div className="d-flex align-items-center border rounded-5 overflow-hidden">
          <Button
            variant="light"
            className="px-3 py-2 border-0 rounded-0"
            onClick={handleRemoveFromCart}
            disabled={quantity! == 1}
          >
            −
          </Button>
          <span
            className="px-3 py-2 fw-semibold border-start border-end text-center"
            style={{ minWidth: 44 }}
          >
            {quantity}
          </span>
          <Button
            variant="light"
            className="px-3 py-2 border-0 rounded-0"
            onClick={handleAddToCart}
            disabled={quantity! >= remainingStock}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);
