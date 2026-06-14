import { useEffect, useState } from "react";
import Cart from "../../../assets/cart.svg?react";
import styles from "./HeaderBasket.module.css";
const { basketContainer, basketQuantity, basket } = styles;
import { useAppSelector } from "../../../store/hooks";
import { itemsTotalQuantity } from "../../../store/cart/selectors/CartSelectors";
import { useNavigate } from "react-router-dom";

const HeaderBasket = () => {
  const [updateQuantity, setUpdateQuantity] = useState(false);
  const getItemsTotalQuantity = useAppSelector(itemsTotalQuantity);
  const navigate = useNavigate();

  useEffect(() => {
    if (!getItemsTotalQuantity) {
      return;
    }

    setUpdateQuantity(true);

    //300ms to wait for anomation end
    const debounser = setTimeout(() => {
      setUpdateQuantity(false);
    }, 300);

    return () => clearTimeout(debounser);
  }, [getItemsTotalQuantity]);

  return (
    <div
      className={`${basketContainer} ${updateQuantity ? styles.animationBehavior : ""}`}
      onClick={() => navigate("cart")}
    >
      <Cart title="basket icon" className={basket} />
      {getItemsTotalQuantity > 0 && (
        <div className={basketQuantity}>{getItemsTotalQuantity}</div>
      )}
    </div>
  );
};

export default HeaderBasket;
